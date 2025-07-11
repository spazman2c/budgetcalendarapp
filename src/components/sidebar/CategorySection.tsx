import { ChevronDown, ChevronRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface Category {
  id: string;
  name: string;
  amount: number;
  color: string;
}

interface CategorySectionProps {
  title: string;
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

export const CategorySection = ({ 
  title, 
  categories, 
  selectedCategory, 
  onCategorySelect 
}: CategorySectionProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [hiddenCategories, setHiddenCategories] = useState<Set<string>>(new Set());

  const toggleCategoryVisibility = (categoryId: string) => {
    const newHidden = new Set(hiddenCategories);
    if (newHidden.has(categoryId)) {
      newHidden.delete(categoryId);
    } else {
      newHidden.add(categoryId);
    }
    setHiddenCategories(newHidden);
  };

  const getCategoryColor = (colorName: string) => {
    const colorMap: Record<string, string> = {
      'income': 'bg-green-100 text-green-700 border-green-300',
      'expense-primary': 'bg-red-100 text-red-700 border-red-300',
      'expense-secondary': 'bg-purple-100 text-purple-700 border-purple-300',
      'expense-tertiary': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'expense-quaternary': 'bg-blue-100 text-blue-700 border-blue-300',
    };
    return colorMap[colorName] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  return (
    <div className="mb-6">
      {/* Section Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors mb-2"
      >
        <h3 className="font-semibold text-sm text-foreground">{title}</h3>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {/* Categories */}
      {isExpanded && (
        <div className="space-y-1">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer group ${
                selectedCategory === category.id ? 'bg-gray-100' : ''
              } ${hiddenCategories.has(category.id) ? 'opacity-50' : ''}`}
              onClick={() => 
                onCategorySelect(selectedCategory === category.id ? null : category.id)
              }
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div 
                  className={`w-3 h-3 rounded-full border ${getCategoryColor(category.color)}`}
                />
                <span className="text-sm font-medium text-foreground truncate">
                  {category.name}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-semibold ${
                  category.amount >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ${Math.abs(category.amount).toLocaleString()}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCategoryVisibility(category.id);
                  }}
                  className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {hiddenCategories.has(category.id) ? (
                    <EyeOff className="w-3 h-3 text-muted-foreground" />
                  ) : (
                    <Eye className="w-3 h-3 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};