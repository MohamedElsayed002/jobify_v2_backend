

import {readFile} from 'fs/promises'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()


import { JobModel } from './models/job.model.js'
import { UserModel } from './models/user.model.js'

try {

    await mongoose.connect(process.env.MONGO_URL)
    const user = await UserModel.findOne({email : 'test@example.com'})
    const jsonJobs = JSON.parse(
        await readFile(new URL('./utils/MOCK_DATA.json' , import.meta.url))
    )

    const jobs = jsonJobs.map((job) => {
        return {...job , createdBy : user._id}
    })

    await JobModel.deleteMany({createdBy : user._id})
    await JobModel.create(jobs)
    console.log('gamed')
    process.exit(0)

}catch(error) {
    console.log(error)
    process.exit(1)
}