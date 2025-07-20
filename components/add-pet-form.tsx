"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function AddPetForm() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    breed: "",
    description: "",
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select an image for the pet",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("file", selectedFile)
      formDataToSend.append("name", formData.name)
      formDataToSend.append("age", formData.age)
      formDataToSend.append("breed", formData.breed)
      formDataToSend.append("description", formData.description)

      const response = await fetch("/api/pets", {
        method: "POST",
        body: formDataToSend,
      })

      if (response.ok) {
        toast({
          title: "Success!",
          description: `${formData.name} has been added to the pet listing`,
        })

        // Reset form
        setFormData({ name: "", age: "", breed: "", description: "" })
        setSelectedFile(null)
        setPreviewUrl(null)

        // Reset file input
        const fileInput = document.getElementById("pet-image") as HTMLInputElement
        if (fileInput) fileInput.value = ""

        // Refresh the page to show the new pet
        window.location.reload()
      } else {
        throw new Error("Failed to add pet")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add pet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Pet Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Buddy"
              required
            />
          </div>

          <div>
            <Label htmlFor="age">Age (years) *</Label>
            <Input
              id="age"
              name="age"
              type="number"
              min="0"
              max="30"
              value={formData.age}
              onChange={handleInputChange}
              placeholder="e.g., 3"
              required
            />
          </div>

          <div>
            <Label htmlFor="breed">Breed *</Label>
            <Input
              id="breed"
              name="breed"
              value={formData.breed}
              onChange={handleInputChange}
              placeholder="e.g., Golden Retriever"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Tell us about this pet's personality..."
              className="min-h-[100px]"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="pet-image">Pet Photo *</Label>
          <div className="mt-2">
            {previewUrl ? (
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <img src={previewUrl || "/placeholder.svg"} alt="Pet preview" className="w-full h-64 object-cover" />
                  <div className="p-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setPreviewUrl(null)
                        setSelectedFile(null)
                        const fileInput = document.getElementById("pet-image") as HTMLInputElement
                        if (fileInput) fileInput.value = ""
                      }}
                      className="w-full"
                    >
                      Change Photo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <div className="space-y-2">
                  <Label htmlFor="pet-image" className="cursor-pointer">
                    <span className="text-sm font-medium text-blue-600 hover:text-blue-500">Click to upload</span>
                    <span className="text-sm text-gray-500"> or drag and drop</span>
                  </Label>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
                <Input
                  id="pet-image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding Pet...
          </>
        ) : (
          "Add Pet to Listing"
        )}
      </Button>
    </form>
  )
}
