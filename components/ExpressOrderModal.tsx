import { useState } from 'react';
import { X, Send, CheckCircle2, ShoppingBag, MapPin, User, Phone, Mail, Hash, Info, MessageCircle } from 'lucide-react';
import { Product } from '@/types';

interface ExpressOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
    variant: string;
}

export default function ExpressOrderModal({ isOpen, onClose, product, variant }: ExpressOrderModalProps) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        location: '',
        quantity: '1',
        contactMethod: 'Phone',
        notes: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        console.log('Submission data:', {
            ...formData,
            productName: product["Product Name"],
            sku: product.SKU,
            variant: variant,
            price: `P ${product.NOW}`
        });

        setIsSubmitted(true);
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-brand-charcoal/60 backdrop-blur-md animate-in fade-in duration-500"
                onClick={onClose}
            />

            {/* Modal - Elevated Boutique Styling */}
            <div className="relative w-full max-w-2xl bg-white rounded-[3.5rem] shadow-premium overflow-hidden border border-brand-sand animate-in zoom-in-95 duration-500 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="p-8 pb-6 flex justify-between items-center bg-brand-sand/50 border-b border-brand-sand/50">
                    <div>
                        <h2 className="text-3xl font-black text-brand-charcoal uppercase tracking-tighter italic">
                            ➤ <span className="text-brand-red">EXPRESS</span> ORDER
                        </h2>
                        <p className="text-[10px] font-black text-brand-green uppercase tracking-[0.4em] mt-1">Gaborone Boutique Concierge</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 rounded-2xl hover:bg-white hover:shadow-lg transition-all active:scale-90 border border-transparent hover:border-brand-sand"
                    >
                        <X className="w-6 h-6 text-brand-charcoal/40" />
                    </button>
                </div>

                {!isSubmitted ? (
                    <div className="overflow-y-auto p-8 flex-grow no-scrollbar summer-gradient">
                        <form id="express-order-form" onSubmit={handleSubmit} className="space-y-10">
                            {/* Product Reference Card */}
                            <div className="bg-white p-6 rounded-[2.5rem] border border-brand-sand flex gap-6 items-center shadow-sm">
                                <div className="w-24 h-24 bg-brand-sand/30 rounded-3xl flex items-center justify-center p-2">
                                    <ShoppingBag className="w-10 h-10 text-brand-yellow" />
                                </div>
                                <div className="flex-grow">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-black text-brand-red uppercase tracking-widest">{product.Category}</span>
                                        <span className="text-[10px] font-black text-gray-200 uppercase tracking-widest">|</span>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">{product.SKU}</span>
                                    </div>
                                    <h3 className="text-xl font-black text-brand-charcoal uppercase tracking-tighter italic">{product["Product Name"]}</h3>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-lg font-black text-brand-red">P {product.NOW}</span>
                                        <span className="text-[10px] font-black text-brand-charcoal/40 uppercase tracking-widest">Selected: {variant}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Name */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-brand-charcoal uppercase tracking-widest ml-4 flex items-center gap-2">
                                        <User className="w-3 h-3 text-brand-red" /> Full Name
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Enter your name"
                                        className="w-full bg-brand-sand/50 border-2 border-brand-sand rounded-2xl px-6 py-4 focus:border-brand-yellow outline-none font-bold transition-all placeholder:text-gray-300"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    />
                                </div>
                                {/* Phone */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-brand-charcoal uppercase tracking-widest ml-4 flex items-center gap-2">
                                        <Phone className="w-3 h-3 text-brand-red" /> Phone Number
                                    </label>
                                    <input
                                        required
                                        type="tel"
                                        placeholder="+267 ..."
                                        className="w-full bg-brand-sand/50 border-2 border-brand-sand rounded-2xl px-6 py-4 focus:border-brand-yellow outline-none font-bold transition-all placeholder:text-gray-300"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                {/* Email */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-brand-charcoal uppercase tracking-widest ml-4 flex items-center gap-2">
                                        <Mail className="w-3 h-3 text-brand-red" /> Email Address
                                    </label>
                                    <input
                                        required
                                        type="email"
                                        placeholder="you@example.com"
                                        className="w-full bg-brand-sand/50 border-2 border-brand-sand rounded-2xl px-6 py-4 focus:border-brand-yellow outline-none font-bold transition-all placeholder:text-gray-300"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                {/* Location */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-brand-charcoal uppercase tracking-widest ml-4 flex items-center gap-2">
                                        <MapPin className="w-3 h-3 text-brand-red" /> Delivery Location
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Gaborone, Tlokweng"
                                        className="w-full bg-brand-sand/50 border-2 border-brand-sand rounded-2xl px-6 py-4 focus:border-brand-yellow outline-none font-bold transition-all placeholder:text-gray-300"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                                {/* Quantity */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-brand-charcoal uppercase tracking-widest ml-4 flex items-center gap-2">
                                        <Hash className="w-3 h-3 text-brand-red" /> Quantity
                                    </label>
                                    <select
                                        className="w-full bg-brand-sand/50 border-2 border-brand-sand rounded-2xl px-6 py-4 focus:border-brand-yellow outline-none font-bold transition-all appearance-none cursor-pointer"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    >
                                        {[1, 2, 3, 4, 5, 10].map(n => (
                                            <option key={n} value={n}>{n} Unit{n > 1 ? 's' : ''}</option>
                                        ))}
                                    </select>
                                </div>
                                {/* Contact Method */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-brand-charcoal uppercase tracking-widest ml-4 flex items-center gap-2">
                                        <MessageCircle className="w-3 h-3 text-brand-red" /> Preferred Contact
                                    </label>
                                    <select
                                        className="w-full bg-brand-sand/50 border-2 border-brand-sand rounded-2xl px-6 py-4 focus:border-brand-yellow outline-none font-bold transition-all appearance-none cursor-pointer"
                                        value={formData.contactMethod}
                                        onChange={(e) => setFormData({ ...formData, contactMethod: e.target.value })}
                                    >
                                        <option value="Phone">Phone Call</option>
                                        <option value="WhatsApp">WhatsApp Message</option>
                                        <option value="Email">Email</option>
                                    </select>
                                </div>
                                {/* Notes */}
                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-[10px] font-black text-brand-charcoal uppercase tracking-widest ml-4 flex items-center gap-2">
                                        <Info className="w-3 h-3 text-brand-red" /> Additional Notes
                                    </label>
                                    <textarea
                                        placeholder="Any special requirements for your order?"
                                        className="w-full bg-brand-sand/50 border-2 border-brand-sand rounded-2xl px-6 py-4 focus:border-brand-yellow outline-none font-bold transition-all min-h-[120px] resize-none placeholder:text-gray-300"
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center p-12 text-center animate-in zoom-in-95 duration-500 summer-gradient">
                        <div className="w-28 h-28 bg-brand-green/10 rounded-full flex items-center justify-center mb-8 border border-brand-green/20">
                            <CheckCircle2 className="w-14 h-14 text-brand-green" />
                        </div>
                        <h3 className="text-4xl font-black text-brand-charcoal uppercase tracking-tighter italic mb-3">Enquiry <span className="text-brand-red">Confirmed</span></h3>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-10 max-w-xs leading-loose">
                            Your boutique order request has been logged. Our Botswana team will reach out via <span className="text-brand-green">{formData.contactMethod}</span> within 24 hours.
                        </p>
                        <button
                            onClick={onClose}
                            className="bg-brand-charcoal text-white px-16 py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] hover:bg-brand-red transition-all shadow-premium hover:shadow-2xl"
                        >
                            Back To Gallery
                        </button>
                    </div>
                )}

                {!isSubmitted && (
                    <div className="p-8 bg-brand-sand/50 border-t border-brand-sand/50">
                        <button
                            form="express-order-form"
                            type="submit"
                            className="w-full bg-brand-charcoal text-brand-yellow py-6 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-xl flex items-center justify-center gap-4 hover:bg-brand-red hover:text-white transition-all shadow-premium active:scale-95 group btn-pulsate"
                        >
                            <Send className="w-6 h-6 animate-pulse" />
                            CONFIRM ENQUIRY
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
