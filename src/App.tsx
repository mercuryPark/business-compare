import { useEffect, useState } from 'react';
import { brands } from './domain/brands';
import type { BrandCategory } from './domain/types';
import { BrandDetail } from './components/BrandDetail';
import { ComparePanel } from './components/ComparePanel';
import { DataSourceFooter } from './components/DataSourceFooter';
import { Dashboard } from './components/Dashboard';

export default function App() {
  const [category, setCategory] = useState<BrandCategory | 'all'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedBrandId, setExpandedBrandId] = useState(brands[0]?.id ?? '');
  const [focusBrandId, setFocusBrandId] = useState('');
  const selectedBrands = brands.filter((brand) => selectedIds.includes(brand.id));
  const expandedBrand = brands.find((brand) => brand.id === expandedBrandId);

  useEffect(() => {
    if (!focusBrandId) return;

    const target = document.getElementById(`brand-${focusBrandId}`);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    target?.focus({ preventScroll: true });
    setFocusBrandId('');
  }, [focusBrandId, expandedBrandId]);

  function toggleSelect(brandId: string) {
    setSelectedIds((current) => {
      if (current.includes(brandId)) return current.filter((id) => id !== brandId);
      if (current.length >= 4) return current;
      return [...current, brandId];
    });
  }

  function openBrand(brandId: string) {
    setExpandedBrandId(brandId);
    setFocusBrandId(brandId);
  }

  return (
    <main className="min-h-screen text-ink">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-5 md:px-6 md:py-8">
        <Dashboard
          brands={brands}
          category={category}
          selectedIds={selectedIds}
          onCategoryChange={setCategory}
          onToggleSelect={toggleSelect}
          onOpenBrand={openBrand}
        />
        <ComparePanel brands={selectedBrands} benchmarkBrands={brands} />
        <div className="space-y-5">
          {expandedBrand && (
            <BrandDetail
              key={expandedBrand.id}
              brand={expandedBrand}
              benchmarkBrands={brands}
              expanded={true}
              onToggle={() => setExpandedBrandId('')}
            />
          )}
        </div>
        <DataSourceFooter />
      </div>
    </main>
  );
}
