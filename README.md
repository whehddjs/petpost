# PetPost - Simple Pet Listing Website

A simple pet adoption listing website built with Next.js, designed to be deployed on AWS EC2 with S3 integration for image storage.

## Features

- 🐾 View adoptable pets with photos, names, ages, and breeds
- 📝 Add new pets via a simple form
- 📸 Image upload and storage in Amazon S3
- 💾 Pet data stored in JSON file (no database required)
- 📱 Responsive design
- 🚀 Easy deployment on EC2

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Storage**: Amazon S3 (images), JSON file (pet data)
- **Deployment**: AWS EC2

## Prerequisites

- AWS Account with S3 access
- EC2 instance (Amazon Linux 2 recommended)
- Node.js 18+ installed on EC2

## Local Development

1. Clone the repository
2. Install dependencies:
 bash
   npm install
 

3. Create `.env.local` file:
 env
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_access_key_here
   AWS_SECRET_ACCESS_KEY=your_secret_key_here
   S3_BUCKET_NAME=petpost-images
 

4. Run the development server:
 bash
   npm run dev
 

## AWS Setup

### 1. Create S3 Bucket

1. Go to AWS S3 Console
2. Create a new bucket named `petpost-images` (or your preferred name)
3. Enable public read access for uploaded images
4. Update the bucket name in your environment variables

### 2. Create IAM User

1. Go to AWS IAM Console
2. Create a new user with programmatic access
3. Attach the following policy:

json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:PutObjectAcl",
                "s3:GetObject"
            ],
            "Resource": "arn:aws:s3:::petpost-images/*"
        }
    ]
}


4. Save the Access Key ID and Secret Access Key

### 3. EC2 Deployment

1. Launch an EC2 instance (Amazon Linux 2)
2. Configure security group to allow HTTP (port 80) and SSH (port 22)
3. Connect to your instance via SSH
4. Run the setup script:


# Copy the setup script to your EC2 instance
chmod +x setup-ec2.sh
./setup-ec2.sh


5. Update the `.env.local` file with your AWS credentials
6. Your application should be accessible at `http://your-ec2-public-ip`



## Environment Variables

- `AWS_REGION`: Your AWS region (e.g., us-east-1)
- `AWS_ACCESS_KEY_ID`: Your AWS access key
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
- `S3_BUCKET_NAME`: Your S3 bucket name for storing images

