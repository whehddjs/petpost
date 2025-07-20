import { PetList } from "@/components/pet-list"
import { AddPetForm } from "@/components/add-pet-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🐾 PetPost</h1>
          <p className="text-lg text-gray-600">Find your perfect furry companion</p>
        </div>

        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="browse">Browse Pets</TabsTrigger>
            <TabsTrigger value="add">Add Pet</TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            <Card>
              <CardHeader>
                <CardTitle>Adoptable Pets</CardTitle>
                <CardDescription>Browse through our wonderful pets looking for their forever homes</CardDescription>
              </CardHeader>
              <CardContent>
                <PetList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>Add New Pet</CardTitle>
                <CardDescription>Help a pet find their home by adding them to our listing</CardDescription>
              </CardHeader>
              <CardContent>
                <AddPetForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
