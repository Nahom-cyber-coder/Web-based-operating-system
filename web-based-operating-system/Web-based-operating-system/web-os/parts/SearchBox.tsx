import React from 'react';
import { useOS } from '../settings/OSContext';
import { Search } from 'lucide-react';

const SearchBox: React.FC = () => {
const { searchQuery, setSearchQuery, setIsStartMenuOpen } = useOS();

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
const value = e.target.value;
setSearchQuery(value);

if (value.trim().length > 0) {
setIsStartMenuOpen(true);
}
};

const handleFocus = () => {
setIsStartMenuOpen(true);
};

return (
<div className="relative">
<Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
<input
type="text"
placeholder="Search..."
value={searchQuery}
onChange={handleInputChange}
onFocus={handleFocus}
className="pl-10 pr-4 py-2 w-64 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50"
/>
</div>
);
};

export default SearchBox;