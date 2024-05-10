# Clear temp folders
rm -rf ./data/boards/gh/*
rm -rf ./data/boards/lever/*
rm -rf ./data/applications/gh/*
rm -rf ./data/applications/lever/*

# Create temp folders
mkdir ./data/boards/gh
mkdir ./data/boards/lever
mkdir ./data/applications/gh
mkdir ./data/applications/lever

# Get job boards
npx ts-node ./companyScrapers/getAccelJobBoards.ts

# Get job applications from those boards
npx ts-node ./utils/getJobAppsFromLever.ts
npx ts-node ./utils/getJobAppsFromGH.ts

# Get job info from those applications
npx ts-node ./utils/getJobInfoFromLeverApplication.ts
npx ts-node ./utils/getJobInfoFromGHApplication.ts

