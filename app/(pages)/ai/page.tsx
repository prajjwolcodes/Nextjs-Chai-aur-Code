"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, ImagePlus, MessageCircle, Languages } from 'lucide-react';
import axios from 'axios';

const AI = () => {
    const [chatMessage, setChatMessage] = useState('');
    const [chatResponse, setChatResponse] = useState('');
    const [translationText, setTranslationText] = useState('');
    const [translationResponse, setTranslationResponse] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imageCaption, setImageCaption] = useState('');
    const [textToImagePrompt, setTextToImagePrompt] = useState('');
    const [generatedImageUrl, setGeneratedImageUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (type) => {
        setLoading(true);
        const formData = new FormData();

        try {
            switch (type) {
                case 'comp':
                    formData.append('message', chatMessage);
                    break;
                case 'translation':
                    formData.append('text', translationText);
                    break;
                case 'imgtt':
                    if (!imageFile) {
                        alert('Please upload an image');
                        setLoading(false);
                        return;
                    }
                    formData.append('image', imageFile);
                    break;
                case 'ttimg':
                    formData.append('prompt', textToImagePrompt);
                    break;
            }

            const data = await axios.post(`/api/ai?type=${type}`, formData);

            console.log(data.data)
            switch (type) {
                case 'comp':
                    setChatResponse(data.data.message.content);
                    setChatMessage("")
                    break;
                case 'translation':
                    setTranslationResponse(data.data.message.translation_text);
                    break;
                case 'imgtt':
                    setImageCaption(data.data.message.generated_text);
                    break;
                case 'ttimg':
                    setGeneratedImageUrl(data.data.message);
                    break;
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    console.log(translationResponse);

    return (
        <div className="container max-w-2xl mx-auto p-4">
            <Tabs defaultValue="chat" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="chat"><MessageCircle className="mr-2" /> Chat</TabsTrigger>
                    <TabsTrigger value="translation"><Languages className="mr-2" /> Translation</TabsTrigger>
                    <TabsTrigger value="imgtt"><Upload className="mr-2" /> Image Caption</TabsTrigger>
                    <TabsTrigger value="ttimg"><ImagePlus className="mr-2" /> Text to Image</TabsTrigger>
                </TabsList>

                <TabsContent value="chat">
                    <Card>
                        <CardHeader>
                            <CardTitle>Chat Completion</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                placeholder="Enter your message"
                                value={chatMessage}
                                onChange={(e) => setChatMessage(e.target.value)}
                                className="mb-4"
                            />
                            <Button
                                onClick={() => handleSubmit('comp')}
                                disabled={loading}
                            >
                                {loading ? "Sending..." : "Send Message"}
                            </Button>
                            {chatResponse && (
                                <div className="mt-4 p-2 bg-gray-100 rounded">
                                    {chatResponse}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="translation">
                    <Card>
                        <CardHeader>
                            <CardTitle>Translate English Into German</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                placeholder="Enter text to translate"
                                value={translationText}
                                onChange={(e) => setTranslationText(e.target.value)}
                                className="mb-4"
                            />
                            <Button
                                onClick={() => handleSubmit('translation')}
                                disabled={loading}
                            >
                                Translate
                                {loading ? "Translatingg..." : "Translate"}

                            </Button>
                            {translationResponse && (
                                <div className="mt-4 p-2 bg-gray-100 rounded">
                                    {translationResponse}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="imgtt">
                    <Card>
                        <CardHeader>
                            <CardTitle>Image to Text</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files[0])}
                                className="mb-4"
                            />
                            <Button
                                onClick={() => handleSubmit('imgtt')}
                                disabled={loading || !imageFile}
                            >

                                {loading ? "Generating..." : "Generate Caption"}

                            </Button>
                            {imageCaption && (
                                <div className="mt-4 p-2 bg-gray-100 rounded">
                                    {imageCaption}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="ttimg">
                    <Card>
                        <CardHeader>
                            <CardTitle>Text to Image</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Input
                                placeholder="Enter image description"
                                value={textToImagePrompt}
                                onChange={(e) => setTextToImagePrompt(e.target.value)}
                                className="mb-4"
                            />
                            <Button
                                onClick={() => handleSubmit('ttimg')}
                                disabled={loading}
                            >
                                {loading ? "Generating..." : "Generate Image"}


                            </Button>
                            {generatedImageUrl && (
                                <div className="mt-4">
                                    <img
                                        src={generatedImageUrl}
                                        alt="Generated"
                                        className="max-w-full h-auto rounded"
                                    />
                                </div>
                            )}
                            {chatMessage}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default AI