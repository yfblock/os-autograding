import * as core from '@actions/core'
import fs from 'fs'
import path from 'path'
import {runAll} from './runner'

const run = async (): Promise<void> => {
  try {
    const cwd = process.env['GITHUB_WORKSPACE']
    if (!cwd) {
      throw new Error('No GITHUB_WORKSPACE')
    }

    let configFile = path.resolve(cwd, '.github/classroom/autograding.json');
    let outputFile = core.getInput('outputFile');
    if(fs.existsSync(configFile)) {
      const data = fs.readFileSync(configFile)
      const json = JSON.parse(data.toString())
      await runAll(json, cwd, outputFile, core.getInput('scriptPath'))
    } else {
      await runAll({}, cwd, outputFile, core.getInput('scriptPath'))
    }

  } catch (error) {
    // If there is any error we'll fail the action with the error message
    console.error(error.message)
    // core.setFailed(`Autograding failure: ${error}`)
  }
}

// Don't auto-execute in the test environment
if (process.env['NODE_ENV'] !== 'test') {
  run()
}

export default run
