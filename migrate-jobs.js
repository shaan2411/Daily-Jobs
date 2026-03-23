const mongoose = require('mongoose');
const Job = require('./models/Job');

const MONGODB_URI = "mongodb://localhost:27017/dailyjobs";

async function migrate() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        const jobs = await Job.find({});
        console.log(`Found ${jobs.length} jobs to check.`);

        for (let job of jobs) {
            let updated = false;
            // If location is not a proper object with coordinates
            if (!job.location || typeof job.location !== 'object' || !job.location.coordinates) {
                console.log(`Migrating job: ${job.title}`);
                job.location = {
                    type: 'Point',
                    coordinates: [0, 0]
                };
                updated = true;
            }
            
            if (updated) {
                await job.save();
                console.log(`Saved migrated job: ${job.title}`);
            }
        }

        console.log("Migration complete.");
        process.exit(0);
    } catch (err) {
        console.error("Migration Failed:", err);
        process.exit(1);
    }
}

migrate();
