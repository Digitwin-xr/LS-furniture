import RetailHeader from "@/components/RetailHeader"
import Footer from "@/components/Footer"

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-brand-sand/30 flex flex-col font-geist">
            <RetailHeader />
            <div className="flex-1 w-full pt-32 pb-24 md:pt-40 lg:pt-48 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
                <div className="max-w-3xl mx-auto space-y-12 animate-in slide-in-from-bottom-8 duration-1000">
                    
                    <div className="flex flex-col gap-6 text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight font-serif uppercase">
                            About Us
                        </h1>
                        <div className="h-1 w-24 bg-brand-green mx-auto rounded-full" />
                    </div>

                    <div className="prose prose-lg prose-gray max-w-none text-gray-600 space-y-8 text-center md:text-left text-lg md:text-xl leading-relaxed font-medium">
                        <p>
                            At <span className="font-bold text-gray-900">LS Furniture & Appliances</span>, we believe every home deserves comfort, style, and reliability without unnecessary cost. Our mission is simple: provide beautifully designed furniture and dependable home appliances that combine modern aesthetics, lasting durability, and genuine value.
                        </p>
                        <p>
                            We carefully select products that balance quality craftsmanship, functional design, and affordability, helping families create spaces that feel welcoming, practical, and uniquely their own.
                        </p>
                        <p>
                            Through our innovative shopping platform, customers can explore collections, compare options, and discover pieces that suit their lifestyle &mdash; all with the confidence that they are investing in trusted products built for everyday living.
                        </p>
                        <p className="font-bold text-gray-900 text-xl md:text-2xl pt-4">
                            Whether furnishing a new home or upgrading essential appliances, LS Furniture & Appliances is committed to delivering comfort, quality, and value you can rely on.
                        </p>
                    </div>

                </div>
            </div>
            <Footer />
        </main>
    )
}
