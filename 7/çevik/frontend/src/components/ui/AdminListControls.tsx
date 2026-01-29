interface SortOption {
    value: string;
    label: string;
}

interface AdminListControlsProps {
    // Search
    searchQuery: string;
    onSearchChange: (query: string) => void;
    searchPlaceholder?: string;
    
    // Sort
    sortBy: string;
    onSortChange: (sort: string) => void;
    sortOptions: SortOption[];
    
    // Result count
    totalCount?: number;
    filteredCount?: number;
}

export default function AdminListControls({
    searchQuery,
    onSearchChange,
    searchPlaceholder = "Ara...",
    sortBy,
    onSortChange,
    sortOptions,
    totalCount,
    filteredCount,
}: AdminListControlsProps) {
    const showCount = totalCount !== undefined || filteredCount !== undefined;
    
    return (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                {/* Search Input */}
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Arama
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Sort Dropdown */}
                <div className="min-w-[180px]">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sıralama
                    </label>
                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={(e) => onSortChange(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 appearance-none cursor-pointer"
                        >
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Result Count */}
            {showCount && (
                <div className="mt-3 text-sm text-gray-600">
                    {filteredCount !== undefined && totalCount !== undefined ? (
                        <>Toplam {totalCount} kayıttan {filteredCount} sonuç gösteriliyor</>
                    ) : filteredCount !== undefined ? (
                        <>Toplam {filteredCount} sonuç bulundu</>
                    ) : (
                        <>Toplam {totalCount} kayıt</>
                    )}
                </div>
            )}
        </div>
    );
}
