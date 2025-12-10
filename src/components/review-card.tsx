import { Bookmark, Flag, Heart, MessageCircle, Share } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"

const ReviewCard = () => {
    return (
        <Card>
            <CardHeader className="flex items-center justify-between w-full">
                <CardTitle className="flex items-center gap-3 cursor-pointer group">
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>AR</AvatarFallback>
                    </Avatar>
                    <span className="transition-all group-hover:underline">
                        Review Card
                    </span>
                </CardTitle>
                <Button variant="ghost" size="icon">
                    <Flag />
                </Button>
            </CardHeader>
            <CardContent className="flex items-start gap-8">
                <div>
                    <h3 className="text-xl font-bold line-clamp-3 cursor-pointer hover:underline">Review Card</h3>
                    <p className="text-sm mt-2 text-gray-500  leading-relaxed text-justify line-clamp-5">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus esse animi obcaecati eveniet soluta. Delectus dolorum eum odit, magni porro mollitia eos? Eveniet reiciendis, nostrum nulla accusamus illo voluptates corrupti numquam tempora? Voluptatem earum laudantium nihil qui cupiditate repellendus beatae?</p>
                </div>
                <div className="shrink-0 w-64 grid grid-cols-3 grid-rows-2 gap-1 rounded-lg overflow-hidden">
                    <button 
                        className="col-span-3 row-span-1 cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => console.log("Image 1 clicked")}
                    >
                        <img 
                            src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop" 
                            alt="Review image 1"
                            className="w-full h-24 object-cover"
                        />
                    </button>
                    <button 
                        className="col-span-1 cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => console.log("Image 2 clicked")}
                    >
                        <img 
                            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=150&fit=crop" 
                            alt="Review image 2"
                            className="w-full h-16 object-cover"
                        />
                    </button>
                    <button 
                        className="col-span-1 cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => console.log("Image 3 clicked")}
                    >
                        <img 
                            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=150&fit=crop" 
                            alt="Review image 3"
                            className="w-full h-16 object-cover"
                        />
                    </button>
                    <button 
                        className="col-span-1 cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => console.log("Image 4 clicked")}
                    >
                        <img 
                            src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=200&h=150&fit=crop" 
                            alt="Review image 4"
                            className="w-full h-16 object-cover"
                        />
                    </button>
                </div>

            </CardContent>
            <CardFooter className="flex items-center justify-between">
                <Button variant="ghost">
                    <MessageCircle />
                    <span>200</span>
                </Button>
                <Button variant="ghost">
                    <Bookmark />
                    <span>7</span>
                </Button>
                <Button variant="ghost">
                    <Heart />
                    <span>623</span>
                </Button>
                <Button variant="ghost">
                    <Share />
                    <span>Bagikan</span>
                </Button>
            </CardFooter>
        </Card>
    )
}

export default ReviewCard