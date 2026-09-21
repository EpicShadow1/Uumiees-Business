import * as React from 'react';
import { cn, formatCurrency } from '@uumiees/utils';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import type { Product as ProductType, ProductImage, ProductVariant } from '@uumiees/types';
import { Badge } from './Alert';
import { Button } from './Button';

export interface ProductCardProps {
  product: ProductType & { primaryImage?: ProductImage | null; averageRating?: number; reviewCount?: number };
  variants?: ProductVariant[];
  onAddToCart?: (productId: number, variantId?: number) => void;
  onAddToWishlist?: (productId: number, variantId?: number) => void;
  onView?: (productId: number) => void;
  className?: string;
}

export function ProductCard({
  product,
  variants,
  onAddToCart,
  onAddToWishlist,
  onView,
  className,
}: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] = React.useState<ProductVariant | undefined>(
    variants?.[0]
  );

  const displayPrice = selectedVariant?.price ?? product.price;
  const displayCompare = selectedVariant?.compare_price ?? product.compare_price;
  const displayStock = selectedVariant?.stock ?? product.stock;

  const handleClick = () => {
    if (onView) {
      onView(product.id);
    }
  };

  return (
    <div
      className={cn(
        'group relative bg-white rounded-2xl overflow-hidden border border-gray-100',
        'transition-all duration-300 hover:shadow-[0_10px_30px_-5px_rgba(23,59,143,0.15)] hover:-translate-y-1',
        className
      )}
    >
      <div
        className="relative aspect-square bg-[#F4F5F7] cursor-pointer overflow-hidden"
        onClick={handleClick}
      >
        {product.primaryImage?.image_url ? (
          <img
            src={product.primaryImage.image_url}
            alt={product.primaryImage.alt_text || product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#9CA3AF] text-6xl">
            📦
          </div>
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.is_featured && (
            <Badge variant="accent" size="sm">
              Featured
            </Badge>
          )}
          {displayStock === 0 && (
            <Badge variant="danger" size="sm">
              Sold Out
            </Badge>
          )}
          {displayCompare && displayCompare > displayPrice && (
            <Badge variant="success" size="sm">
              {Math.round((1 - displayPrice / displayCompare) * 100)}% OFF
            </Badge>
          )}
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {onAddToWishlist && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToWishlist(product.id, selectedVariant?.id);
              }}
              className="w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center text-[#6B7280] hover:text-[#C73E3A] hover:bg-red-50 transition-colors"
              aria-label="Add to wishlist"
            >
              <Heart size={16} />
            </button>
          )}
        </div>

        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {onAddToCart && (
            <Button
              variant="primary"
              size="sm"
              fullWidth
              leftIcon={<ShoppingCart size={14} />}
              disabled={displayStock === 0}
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product.id, selectedVariant?.id);
              }}
            >
              Add to Cart
            </Button>
          )}
        </div>
      </div>

      <div className="p-4">
        {product.averageRating !== undefined && (
          <div className="flex items-center mb-2">
            <div className="flex items-center mr-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={cn(
                    i < Math.round(product.averageRating!)
                      ? 'fill-[#D4AF37] text-[#D4AF37]'
                      : 'text-gray-300'
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-[#6B7280]">
              {product.averageRating.toFixed(1)}
              {product.reviewCount !== undefined && ` (${product.reviewCount})`}
            </span>
          </div>
        )}

        <h3
          onClick={handleClick}
          className="font-semibold text-[#171A21] mb-2 line-clamp-2 hover:text-[#173B8F] transition-colors cursor-pointer min-h-[2.5rem]"
        >
          {product.name}
        </h3>

        {variants && variants.length > 1 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariant(v)}
                className={cn(
                  'px-2 py-0.5 text-xs rounded-md border transition-all',
                  selectedVariant?.id === v.id
                    ? 'bg-[#173B8F] text-white border-[#173B8F]'
                    : 'bg-white text-[#171A21] border-gray-200 hover:border-[#173B8F]/50'
                )}
              >
                {v.name}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-[#173B8F]">
                {formatCurrency(displayPrice)}
              </span>
              {displayCompare && displayCompare > displayPrice && (
                <span className="text-sm text-[#9CA3AF] line-through">
                  {formatCurrency(displayCompare)}
                </span>
              )}
            </div>
            <p
              className={cn(
                'text-xs mt-0.5 font-medium',
                displayStock > 0 ? 'text-[#1F8A5B]' : 'text-[#C73E3A]'
              )}
            >
              {displayStock > 0 ? `${displayStock} in stock` : 'Out of stock'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
