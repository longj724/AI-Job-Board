# Get the absolute path to the project directory
PROJECT_DIR="$(pwd)"

# Clear temp folders
rm -rf "$PROJECT_DIR/data/boards/gh/*"
rm -rf "$PROJECT_DIR/data/boards/lever/*"
rm -rf "$PROJECT_DIR/data/applications/gh/*"
rm -rf "$PROJECT_DIR/data/applications/lever/*"

# Create temp folders
mkdir "$PROJECT_DIR/data/boards/gh"
mkdir "$PROJECT_DIR/data/boards/lever"
mkdir "$PROJECT_DIR/data/applications/gh"
mkdir "$PROJECT_DIR/data/applications/lever"

# Get job boards
npx ts-node "$PROJECT_DIR/companyScrapers/getAccelJobBoards.ts"

# Get job applications from those boards
npx ts-node "$PROJECT_DIR/utils/getJobAppsFromLever.ts"
npx ts-node "$PROJECT_DIR/utils/getJobAppsFromGH.ts"

# Get job info from those applications
npx ts-node "$PROJECT_DIR/utils/getJobInfoFromLeverApplication.ts"
npx ts-node "$PROJECT_DIR/utils/getJobInfoFromGHApplication.ts"

