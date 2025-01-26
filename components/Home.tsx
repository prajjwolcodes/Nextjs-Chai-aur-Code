'use client'

import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSession } from 'next-auth/react';
import Navbar from './Navbar';
import Link from 'next/link';

const HomePage = () => {
    const { data: session } = useSession()
    const user = session?.user
    return (
        <>
            <div className="max-w-2xl mx-auto">
                <Card className="p-6 shadow-lg text-center">
                    <h1 className="text-3xl font-bold mb-4 text-gray-800">
                        Welcome, {user?.username}
                    </h1>

                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                        <p className="text-blue-800 mb-3">
                            Your personal communication hub is ready!
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Link href='/dashboard'>
                                <Button variant="outline">
                                    View Dashboard
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>


            </div>
        </>
    );
};

export default HomePage;


// import React, { useState } from 'react';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Upload, ImagePlus, MessageCircle, Languages } from 'lucide-react';

// export default function HuggingFaceInterface() {
//     const [chatMessage, setChatMessage] = useState('');
//     const [chatResponse, setChatResponse] = useState('');
//     const [translationText, setTranslationText] = useState('');
//     const [translationResponse, setTranslationResponse] = useState('');
//     const [imageFile, setImageFile] = useState(null);
//     const [imageCaption, setImageCaption] = useState('');
//     const [textToImagePrompt, setTextToImagePrompt] = useState('');
//     const [generatedImageUrl, setGeneratedImageUrl] = useState('');
//     const [loading, setLoading] = useState(false);

//     const handleSubmit = async (type) => {
//         setLoading(true);
//         const formData = new FormData();

//         try {
//             switch (type) {
//                 case 'comp':
//                     formData.append('message', chatMessage);
//                     break;
//                 case 'translation':
//                     formData.append('text', translationText);
//                     break;
//                 case 'imgtt':
//                     if (!imageFile) {
//                         alert('Please upload an image');
//                         setLoading(false);
//                         return;
//                     }
//                     formData.append('image', imageFile);
//                     break;
//                 case 'ttimg':
//                     formData.append('prompt', textToImagePrompt);
//                     break;
//             }

//             const response = await fetch(`/api/huggingface?type=${type}`, {
//                 method: 'POST',
//                 body: formData
//             });

//             const data = await response.json();

//             switch (type) {
//                 case 'comp':
//                     setChatResponse(data.message.content);
//                     break;
//                 case 'translation':
//                     setTranslationResponse(data.message);
//                     break;
//                 case 'imgtt':
//                     setImageCaption(data.message[0].generated_text);
//                     break;
//                 case 'ttimg':
//                     setGeneratedImageUrl(data.message);
//                     break;
//             }
//         } catch (error) {
//             console.error('Error:', error);
//             alert('An error occurred');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="container mx-auto p-4">
//             <Tabs defaultValue="chat" className="w-full">
//                 <TabsList className="grid w-full grid-cols-4">
//                     <TabsTrigger value="chat"><MessageCircle className="mr-2" /> Chat</TabsTrigger>
//                     <TabsTrigger value="translation"><Languages className="mr-2" /> Translation</TabsTrigger>
//                     <TabsTrigger value="imgtt"><Upload className="mr-2" /> Image Caption</TabsTrigger>
//                     <TabsTrigger value="ttimg"><ImagePlus className="mr-2" /> Text to Image</TabsTrigger>
//                 </TabsList>

//                 <TabsContent value="chat">
//                     <Card>
//                         <CardHeader>
//                             <CardTitle>Chat Completion</CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                             <Textarea
//                                 placeholder="Enter your message"
//                                 value={chatMessage}
//                                 onChange={(e) => setChatMessage(e.target.value)}
//                                 className="mb-4"
//                             />
//                             <Button
//                                 onClick={() => handleSubmit('comp')}
//                                 disabled={loading}
//                             >
//                                 Send Message
//                             </Button>
//                             {chatResponse && (
//                                 <div className="mt-4 p-2 bg-gray-100 rounded">
//                                     {chatResponse}
//                                 </div>
//                             )}
//                         </CardContent>
//                     </Card>
//                 </TabsContent>

//                 <TabsContent value="translation">
//                     <Card>
//                         <CardHeader>
//                             <CardTitle>Translation</CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                             <Textarea
//                                 placeholder="Enter text to translate"
//                                 value={translationText}
//                                 onChange={(e) => setTranslationText(e.target.value)}
//                                 className="mb-4"
//                             />
//                             <Button
//                                 onClick={() => handleSubmit('translation')}
//                                 disabled={loading}
//                             >
//                                 Translate
//                             </Button>
//                             {translationResponse && (
//                                 <div className="mt-4 p-2 bg-gray-100 rounded">
//                                     {translationResponse}
//                                 </div>
//                             )}
//                         </CardContent>
//                     </Card>
//                 </TabsContent>

//                 <TabsContent value="imgtt">
//                     <Card>
//                         <CardHeader>
//                             <CardTitle>Image to Text</CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                             <Input
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={(e) => setImageFile(e.target.files[0])}
//                                 className="mb-4"
//                             />
//                             <Button
//                                 onClick={() => handleSubmit('imgtt')}
//                                 disabled={loading || !imageFile}
//                             >
//                                 Generate Caption
//                             </Button>
//                             {imageCaption && (
//                                 <div className="mt-4 p-2 bg-gray-100 rounded">
//                                     {imageCaption}
//                                 </div>
//                             )}
//                         </CardContent>
//                     </Card>
//                 </TabsContent>

//                 <TabsContent value="ttimg">
//                     <Card>
//                         <CardHeader>
//                             <CardTitle>Text to Image</CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                             <Input
//                                 placeholder="Enter image description"
//                                 value={textToImagePrompt}
//                                 onChange={(e) => setTextToImagePrompt(e.target.value)}
//                                 className="mb-4"
//                             />
//                             <Button
//                                 onClick={() => handleSubmit('ttimg')}
//                                 disabled={loading}
//                             >
//                                 Generate Image
//                             </Button>
//                             {generatedImageUrl && (
//                                 <div className="mt-4">
//                                     <img
//                                         src={generatedImageUrl}
//                                         alt="Generated"
//                                         className="max-w-full h-auto rounded"
//                                     />
//                                 </div>
//                             )}
//                         </CardContent>
//                     </Card>
//                 </TabsContent>
//             </Tabs>
//         </div>
//     );
// }