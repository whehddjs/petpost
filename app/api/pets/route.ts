import { type NextRequest, NextResponse } from "next/server"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { promises as fs } from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
})

const BUCKET_NAME = process.env.S3_BUCKET_NAME || "petpost-images"
const DATA_FILE_PATH = path.join(process.cwd(), "data", "pets.json")

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.dirname(DATA_FILE_PATH)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Read pets data
async function readPetsData() {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(DATA_FILE_PATH, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    // If file doesn't exist, return empty array
    return { pets: [] }
  }
}

// Write pets data
async function writePetsData(data: any) {
  await ensureDataDirectory()
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2))
}

// GET - Fetch all pets
export async function GET() {
  try {
    const data = await readPetsData()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error reading pets data:", error)
    return NextResponse.json({ error: "Failed to fetch pets" }, { status: 500 })
  }
}

// POST - Add new pet
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const name = formData.get("name") as string
    const age = Number.parseInt(formData.get("age") as string)
    const breed = formData.get("breed") as string
    const description = formData.get("description") as string

    if (!file || !name || !age || !breed) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate unique filename
    const fileExtension = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExtension}`

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to S3
    const uploadCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
     // ACL: "public-read", // Make the image publicly accessible
    })

    await s3Client.send(uploadCommand)

    // Construct S3 URL
    const imageUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com/${fileName}`

    // Create pet object
    const newPet = {
      id: uuidv4(),
      name,
      age,
      breed,
      description: description || "",
      imageUrl,
      addedAt: new Date().toISOString(),
    }

    // Read existing data and add new pet
    const data = await readPetsData()
    data.pets.push(newPet)

    // Write updated data
    await writePetsData(data)

    return NextResponse.json({ success: true, pet: newPet })
  } catch (error) {
    console.error("Error adding pet:", error)
    return NextResponse.json({ error: "Failed to add pet" }, { status: 500 })
  }
}
