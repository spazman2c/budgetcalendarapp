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
      'income': 'bg-income/20 text-income border-income/30',
      'expense-primary': 'bg-expense-primary/20 text-expense-primary border-expense-primary/30',
      'expense-secondary': 'bg-expense-secondary/20 text-expense-secondary border-expense-secondary/30',
      'expense-tertiary': 'bg-expense-tertiary/20 text-expense-tertiary border-expense-tertiary/30',
      'expense-quaternary': 'bg-expense-quaternary/20 text-expense-quaternary border-expense-quaternary/30',
    };
    return colorMap[colorName] || 'bg-muted text-muted-foreground border-border';
  };

  return (
    <div className="mb-6">
      {/* Section Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors mb-2"
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
              className={`category-item ${
                selectedCategory === category.id ? 'bg-muted' : ''
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
                  category.amount >= 0 ? 'text-income' : 'text-expense-primary'
                }`}>
                  ${Math.abs(category.amount).toLocaleString()}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCategoryVisibility(category.id);
                  }}
                  className="p-1 hover:bg-muted/70 rounded opacity-0 group-hover:opacity-100 transition-opacity"
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