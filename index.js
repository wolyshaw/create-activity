#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const { argv } = require('yargs')
	.demand(['name'])
	.default({ type: 'web' })
	.describe({ type: '活动终端(web|mobile)', name: '活动名称', path: '指定模板目录地址' })

const activePath = process.cwd()
const tplPath = path.join(__dirname, 'tpl', argv.type)

const copy = path => new Promise((resolve, reject) => {
	fs.readdir(path, (err, files) => {
		if (err) reject(err)
		resolve(files)
	})
})

copy(tplPath)
	.then(files => {
		let _path = path.join(activePath, argv.name)
		fs.exists(_path, info => {
			if (!info) {
				fs.mkdirSync(_path)
			}
		})
		return files
	})
	.then(files => {
		files.map(file => {
			fs.readFile(path.join(tplPath, file), (err, buffer) => {
				if (err) return err
				let _path = path.join(activePath, argv.name, file)
				fs.writeFile(_path, buffer.toString(), 'utf8', (error, data) => {
					if(error) return error
					console.log(`copy success ${_path}`)
				})
			})
		})
	})
	.catch(err => console.log(err))
