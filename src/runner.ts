import * as core from '@actions/core'
import {setCheckRunOutput} from './output'
import * as os from 'os'
import chalk from 'chalk'
import {readFileSync, readdirSync} from 'fs'
import path from 'path'

const color = new chalk.Instance({level: 1})

export type TestComparison = 'exact' | 'included' | 'regex'

export interface Test {
  readonly name: string
  readonly contains?: string
  readonly points: number
}

export interface TestConfig {
  readonly outputFile: string
  readonly tests: Array<Test>
}

export class TestError extends Error {
  constructor(message: string) {
    super(message)
    Error.captureStackTrace(this, TestError)
  }
}

export class TestTimeoutError extends TestError {
  constructor(message: string) {
    super(message)
    Error.captureStackTrace(this, TestTimeoutError)
  }
}

export class TestOutputError extends TestError {
  expected: string
  actual: string

  constructor(message: string, expected: string, actual: string) {
    super(`${message}\nExpected:\n${expected}\nActual:\n${actual}`)
    this.expected = expected
    this.actual = actual

    Error.captureStackTrace(this, TestOutputError)
  }
}

const log = (text: string): void => {
  process.stdout.write(text + os.EOL)
}

export const runAll = async (testConfig: TestConfig, cwd: string): Promise<void> => {
  let points = 0
  let availablePoints = 0

  // https://help.github.com/en/actions/reference/development-tools-for-github-actions#stop-and-start-log-commands-stop-commands
  log('::os autograding::')

  const fileValue = readFileSync(path.join(cwd, testConfig.outputFile)).toString()

  let gradeFiles = readdirSync(cwd);
  for(let i = 0;i < gradeFiles.length; i++) {
    let scriptFilePath = path.join(cwd, gradeFiles[i])
    if(scriptFilePath.endsWith(".js")) {
      let scriptFile = await import(scriptFilePath)
      for(let i = 0; i < scriptFile.points.length; i++) {
        availablePoints += scriptFile.points[i].available
      }
      
      let result = scriptFile.judge(fileValue)
      for(let i = 0; i < result.length; i++) {
        points += result[i].points
      }
    }
  }
  // for (const test of testConfig.tests) {
  //   availablePoints += test.points

  //   if (test.contains) {
  //     if (fileValue.indexOf(test.contains) >= 0) {
  //       points += 2
  //     }
  //   }
  // }
  // for (const test of tests) {
  //   try {
  //     if (test.points) {
  //       availablePoints += test.points
  //     }
  //     log(color.cyan(`📝 ${test.name}`))
  //     log('')
  //     await run(test, cwd)
  //     log('')
  //     log(color.green(`✅ ${test.name}`))
  //     log(``)
  //     if (test.points) {
  //       points += test.points
  //     }
  //   } catch (error) {
  //     failed = true
  //     log('')
  //     log(color.red(`❌ ${test.name}`))
  //     // core.setFailed(error.message)
  //   }
  // }

  // Restart command processing

  // Set the number of points
  const text = `Points ${points}/${availablePoints}`
  log(color.bold.bgCyan.black(text))
  core.setOutput('Points', `${points}/${availablePoints}`)
  await setCheckRunOutput(text)

  if (points == availablePoints) {
    log('')
    log(color.green('All tests passed'))
    log('')
    log('✨🌟💖💎🦄💎💖🌟✨🌟💖💎🦄💎💖🌟✨')
    log('')
  }
}
