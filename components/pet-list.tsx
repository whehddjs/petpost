"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Calendar, Dog } from "lucide-react"
import Image from "next/image"

interface Pet {
  id: string
  name: string
  age: number
  breed: string
  imageUrl: string
  description?: string
  addedAt: string
}

export function PetList() {
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPets()
  }, [])

  const fetchPets = async () => {
    try {
      const response = await fetch("/api/pets")
      const data = await response.json()
      setPets(data.pets || [])
    } catch (error) {
      console.error("Error fetching pets:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg"></div>
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    )
  }

  if (pets.length === 0) {
    return (
      <div className="text-center py-12">
        <Dog className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No pets yet</h3>
        <p className="text-gray-500">Be the first to add a pet to our listing!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pets.map((pet) => (
        <Card key={pet.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative h-48 w-full">
            <Image
              src={pet.imageUrl || "/placeholder.svg"}
              alt={pet.name}
              fill
              className="object-cover"
              crossOrigin="anonymous"
            />
          </div>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{pet.name}</CardTitle>
              <Heart className="h-5 w-5 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
            </div>
            <CardDescription className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {pet.age} {pet.age === 1 ? "year" : "years"} old
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="mb-2">
              {pet.breed}
            </Badge>
            {pet.description && <p className="text-sm text-gray-600 mt-2">{pet.description}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
