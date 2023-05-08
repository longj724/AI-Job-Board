#!/bin/bash

# Clear folders
rm -rf data/boards/gh/*
rm -rf data/boards/lever/*
rm -rf data/openings/gh/*
rm -rf data/openings/lever/*
rm -rf data/postings/gh/*
rm -rf data/postings/lever/*
rm -rf data/parsedPostings/*

touch data/postings/gh/postings.txt
touch data/postings/lever/postings.txt

# Scrape websites
node ./scrapers/a16z.js
node ./scrapers/accel.js

node ./scrapers/getJobPostings.js
# node ./scrapers/bessemer.js
# node ./scrapers/greycroft.js
# node ./scrapers/canaan.js

# Modify database
# node ./db/getGh.js
# node ./db/getLever.js