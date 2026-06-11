import { FiSearch, FiX } from 'react-icons/fi';
import { MdAutoAwesome } from 'react-icons/md';

function SearchBar({
  value,
  onChange,
  placeholder = 'Search properties...',
  sticky = false,
  onClear,
  isAi = false,
}) {
  const handleClear = () => {
    onChange('');
    if (onClear) onClear();
  };

  return (
    <div className={`search-bar ${sticky ? 'sticky' : ''}`} id="search-bar">
      {isAi ? (
        <MdAutoAwesome className="search-icon animate-float" size={18} style={{ color: 'var(--color-accent)' }} />
      ) : (
        <FiSearch className="search-icon" size={18} />
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="search-input"
        aria-label="Search properties"
      />
      {value && (
        <button
          className="search-clear"
          onClick={handleClear}
          type="button"
          aria-label="Clear search"
        >
          <FiX size={18} />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
