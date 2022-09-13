import * as core from '@actions/core'
import * as github from '@actions/github'
import * as axios from 'axios'
import {setCheckRunOutput} from './output'
import * as os from 'os'
import chalk from 'chalk'
import {readFileSync, readdirSync} from 'fs'
import path from 'path'

const color = new chalk.Instance({level: 1})

export type TestComparison = 'exact' | 'included' | 'regex'

export interface TestConfig {
  readonly outputFile: string,
  readonly externalFile?: string
}

const log = (text: string): void => {
  process.stdout.write(text + os.EOL)
}

let resultPoints = {};

export const runAll = async (testConfig: TestConfig, cwd: string): Promise<void> => {
  let points = 0
  let availablePoints = 0

  // https://help.github.com/en/actions/reference/development-tools-for-github-actions#stop-and-start-log-commands-stop-commands
  log('::os autograding::')

  const fileValue = readFileSync(path.join(cwd, testConfig.outputFile)).toString()
  const classRoomPath = path.join(cwd, '.github/classroom/');
  let gradeFiles = readdirSync(classRoomPath);
  for(let i = 0;i < gradeFiles.length; i++) {
    if(gradeFiles[i] == testConfig.externalFile) continue;
    let scriptFilePath = path.join(classRoomPath, gradeFiles[i])
    if(scriptFilePath.endsWith(".js")) {
      let scriptFile = await import(scriptFilePath)
      
      let result = scriptFile.judge(fileValue)
      resultPoints = {resultPoints, ...result}

      // output the result
      for(let key in result) {
        points += result[key][0];
        availablePoints += result[key][1];

        if (result[key][0] == result[key][1]) {
          log(color.green(`✅ ${key} pass`))
        } else {
          log(color.red(`❌ ${key} points ${result[key][0]}/${result[key][1]}`))
        }
      }
    }
  }

  // Restart command processing

  // handle external result
  if (testConfig.externalFile) {
    let externalFile = await import(path.join(classRoomPath, testConfig.externalFile));
    await externalFile.run({points, availablePoints}, {
      log,
      github,
      axios
    });
  }

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
