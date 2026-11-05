'use client';

import { startTransition, useActionState, useState } from 'react';
import type { Product } from '@/lib/types';
import { CATEGORIES, METALS, STONES } from '@/lib/types';
import { ART_KEYS, ProductArt } from '@/components/ProductArt';
import { saveProductAction } from '../../actions';

const L = {
  cat: { rings: 'Кольца', earrings: 'Серьги', necklaces: 'Колье и подвески', bracelets: 'Браслеты', brooches: 'Броши' },
  metal: { white: 'Белое золото', yellow: 'Жёлтое золото', rose: 'Розовое золото' },
  stone: { diamond: 'Бриллиант', sapphire: 'Сапфир', emerald: 'Изумруд', ruby: 'Рубин' },
} as const;

export function ProductForm({ p }: { p?: Product }) {
  const [state, action, pending] = useActionState(saveProductAction, null);
  const [art, setArt] = useState(p?.art ?? 'solitaire');
  const [metal, setMetal] = useState(p?.metal ?? 'white');
  const [stone, setStone] = useState(p?.stone ?? 'diamond');
  const [keep, setKeep] = useState<string[]>(p?.images ?? []);
  const [previews, setPreviews] = useState<string[]>([]);

  return (
    // submitted by hand: <form action> clears every field when the server returns an error
    <form className="adm-form" onSubmit={(e) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      startTransition(() => action(fd));
    }}>
      {p && <input type="hidden" name="id" value={p.id} />}
      <div className="adm-form__grid">
        <div className="adm-card">
          <h2>Основное</h2>
          <div className="field"><label>Название *</label><input name="name_ru" defaultValue={p?.name_ru} required /></div>
          <div className="field"><label>Описание</label><textarea name="desc_ru" defaultValue={p?.desc_ru} rows={4} /></div>
          <div className="field"><label>Адрес страницы (slug)</label><input name="slug" defaultValue={p?.slug} placeholder="создастся из названия" /></div>
        </div>

        <div className="adm-card">
          <h2>Характеристики</h2>
          <div className="adm-2">
            <div className="field"><label>Цена, $</label><input name="price" defaultValue={p?.price ?? ''} placeholder="пусто = по запросу" inputMode="numeric" /></div>
            <div className="field"><label>Вес бриллиантов, ct</label><input name="carat" defaultValue={p?.carat ?? ''} inputMode="decimal" /></div>
          </div>
          <div className="field"><label>Категория</label>
            <select name="category" defaultValue={p?.category ?? 'rings'}>{CATEGORIES.map((c) => <option key={c} value={c}>{L.cat[c]}</option>)}</select>
          </div>
          <div className="adm-2">
            <div className="field"><label>Металл</label>
              <select name="metal" value={metal} onChange={(e) => setMetal(e.target.value as typeof metal)}>{METALS.map((m) => <option key={m} value={m}>{L.metal[m]}</option>)}</select>
            </div>
            <div className="field"><label>Камень</label>
              <select name="stone" value={stone} onChange={(e) => setStone(e.target.value as typeof stone)}>{STONES.map((s) => <option key={s} value={s}>{L.stone[s]}</option>)}</select>
            </div>
          </div>
          <div className="field"><label>Размеры колец (через запятую)</label><input name="sizes" defaultValue={p?.sizes.join(', ')} placeholder="16, 16.5, 17" /></div>
          <label className="adm-check"><input type="checkbox" name="featured" defaultChecked={p?.featured} /> Показывать на главной</label>
          <label className="adm-check"><input type="checkbox" name="in_stock" defaultChecked={p ? p.in_stock : true} /> В наличии</label>
        </div>

        <div className="adm-card">
          <h2>Фотографии</h2>
          <p className="muted" style={{ fontSize: 13, marginBottom: 14 }}>JPG, PNG или WebP до 12 МБ. Первое фото — главное, второе показывается при наведении.</p>
          <div className="adm-photos">
            {keep.map((src) => (
              <div key={src} className="adm-photo">
                <img src={src} alt="" />
                <input type="hidden" name="keep_images" value={src} />
                <button type="button" onClick={() => setKeep(keep.filter((x) => x !== src))} aria-label="Удалить">×</button>
              </div>
            ))}
            {previews.map((src) => <div key={src} className="adm-photo is-new"><img src={src} alt="" /></div>)}
          </div>
          <input type="file" name="images" accept="image/jpeg,image/png,image/webp,image/avif" multiple
            onChange={(e) => setPreviews(Array.from(e.target.files ?? []).map((f) => URL.createObjectURL(f)))} />

          <h2 style={{ marginTop: 28 }}>Иллюстрация (если нет фото)</h2>
          <div className="adm-arts">
            {ART_KEYS.map((k) => (
              <label key={k} className={`adm-art ${art === k ? 'is-on' : ''}`}>
                <input type="radio" name="art" value={k} checked={art === k} onChange={() => setArt(k)} hidden />
                <ProductArt art={k} metal={metal} stone={stone} />
              </label>
            ))}
          </div>
        </div>
      </div>
      {state?.error && <p className="error" style={{ marginTop: 16 }}>{state.error}</p>}
      <div className="adm-form__bar">
        <button className="btn btn--dark" disabled={pending}>{pending ? 'Сохраняем…' : 'Сохранить'}</button>
      </div>
    </form>
  );
}
