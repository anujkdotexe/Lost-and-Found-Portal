import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Heart } from 'lucide-react';
import { format } from 'date-fns';

const ItemCard = ({ item }) => {
    const isLost = item.category === 'Lost';

    return (
        <div className="bg-white rounded-3xl subtle-shadow overflow-hidden group hover:-translate-y-1 transition-transform duration-300 border border-transparent hover:border-gray-100 pb-4">
            <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <Heart size={32} className="mb-2 opacity-50" />
                        <span className="text-sm">No photo</span>
                    </div>
                )}
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${isLost ? 'bg-[#ffeaf0] text-[var(--color-primary)]' : 'bg-[#eaf3ff] text-[var(--color-secondary)]'
                    }`}>
                    {item.category}
                </div>
            </div>

            <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-1 truncate">{item.title}</h3>

                <div className="flex items-center text-sm text-gray-500 mb-2 mt-3">
                    <MapPin size={16} className="mr-1 text-gray-400" />
                    <span className="truncate">{item.location}</span>
                </div>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Calendar size={16} className="mr-1 text-gray-400" />
                    <span>{format(new Date(item.date), 'MMM dd, yyyy')}</span>
                </div>

                <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 overflow-hidden">
                            {item.owner?.avatar ? (
                                <img src={item.owner.avatar} alt="Owner preview" className="w-full h-full object-cover" />
                            ) : (
                                item.owner?.name?.charAt(0).toUpperCase() || 'U'
                            )}
                        </div>
                        <span className="text-sm font-medium text-gray-600 truncate max-w-[100px]">{item.owner?.name || 'User'}</span>
                    </div>

                    <Link to={`/item/${item._id}`} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${isLost ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]' : 'bg-[var(--color-secondary)] text-white hover:bg-blue-400'
                        }`}>
                        View Details
                    </Link>
                </div>

                {item.status === 'Claimed' && (
                    <div className="absolute top-0 left-0 w-full h-full bg-white/80 backdrop-blur-[2px] z-10 flex items-center justify-center">
                        <span className="bg-green-100 text-green-700 font-bold px-4 py-2 rounded-full shadow-sm transform -rotate-12 border border-green-200 text-lg">
                            Resolved ✨
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ItemCard;
