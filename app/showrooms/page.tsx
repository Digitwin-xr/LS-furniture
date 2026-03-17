import RetailHeader from '@/components/RetailHeader';
import Footer from '@/components/Footer';
import OurShowrooms from '@/components/OurShowrooms';

export default function ShowroomsPage() {
    return (
        <div className="min-h-screen bg-white">
            <RetailHeader />
            <main className="pt-24">
                <div className="max-w-[1400px] mx-auto px-6 py-12">
                    <OurShowrooms />
                </div>
            </main>
            <Footer />
        </div>
    );
}
