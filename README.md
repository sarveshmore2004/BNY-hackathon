# BIC Bank Audit Automation

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)

## Project Overview

BIC Bank aims to automate the audit request process for financial statements using Machine Learning (ML) and Artificial Intelligence (AI). The project focuses on:

- Extracting data from bank statements.
- Presenting the data in a user-friendly manner.
- Detecting fraudulent transactions.
- Allowing manual review and edits.
- Providing data export functionality.

## Features

- **Data Extraction**: Utilize Tesseract.js for OCR to extract text from PDF bank statements by splitting them into images.
- **UI Presentation**: Load extracted data on the UI in a structured tabular format.
- **Accuracy Score**: Display extraction accuracy scores to assess the effectiveness of the extraction process.
- **Fraud Detection**: Implement algorithms and the Gemini API to identify fraudulent transactions.
- **Manual Review**: Allow users to manually review or edit extracted data on-screen.
- **Data Saving**: Enable users to save edited data.
- **CSV Export**: Provide functionality to export extracted data into CSV format.
- **Data Visualization**: Use Chart.js to represent data insights and fraud detection results visually.

## Tech Stack

- **Frontend**: ReactJS, Chart.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **OCR**: Tesseract.js
- **Fraud Detection**: Gemini API , Algorithms

