import { createSignal, Show, For, onMount } from 'solid-js';
import { type Component } from 'solid-js';
import * as styles from './App.css';
import DraggableComponent from './components/draggable_component';

import {
  getAllItems,
  findOrCreateRecipe,
  type Item,
} from './data/crafting';

const SIDEBAR_WIDTH = -50;

type ComponentState = {
  id: string;
  itemName: string;
  emote: string;
  pos: { x: number; y: number; width: number; height: number };
  visible: boolean;
  isCrafted: boolean;
};

const App: Component = () => {
  // Store all items and discovered items separately
  const [items, setItems] = createSignal<Item[]>([]);
  const [discovered, setDiscovered] = createSignal<string[]>([]); // item names
  const [components, setComponents] = createSignal<ComponentState[]>([]);
  const [touchedId, setTouchedId] = createSignal<string | null>(null);
  const [loadingPair, setLoadingPair] = createSignal<[string, string] | null>(null);
  const [craftingInProgress, setCraftingInProgress] = createSignal(false);
  const [search, setSearch] = createSignal('');



  // Load items and recipes on mount
  onMount(async () => {
  const backendItems = await getAllItems();
  setItems(backendItems);

  // Ensure at least first 4 items are discovered initially
  const initialDiscovered = backendItems.slice(0, 4).map(i => i.name);
  setDiscovered(initialDiscovered);
});

  const generateId = (itemName: string) => {
    const existingIds = components().filter(c => c.itemName === itemName).length;
    return `${itemName}-${existingIds + 1}`;
  };

  const isOverlapping = (id1: string, id2: string) => {
    const comp1 = components().find(c => c.id === id1);
    const comp2 = components().find(c => c.id === id2);
    if (!comp1 || !comp2) return false;
    const a = comp1.pos;
    const b = comp2.pos;
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  };

  const updatePosition = (id: string, newPos: { x: number; y: number; width: number; height: number }) => {
    setComponents(prev =>
      prev.map(comp =>
        comp.id === id ? { ...comp, pos: newPos } : comp
      )
    );
  };

  const handleRelease = async (id: string, x: number, y: number) => {
    if (craftingInProgress()) return;
    setCraftingInProgress(true);

    const comp = components().find(c => c.id === id);
    if (!comp) {
      setCraftingInProgress(false);
      return;
    }

    if (comp.pos.x < SIDEBAR_WIDTH) {
      setComponents(prev => prev.filter(c => c.id !== id));
      setCraftingInProgress(false);
      return;
    }

    const overlappingComps = components().filter(c =>
      c.id !== id &&
      c.visible &&
      isOverlapping(id, c.id)
    );

    const target = overlappingComps[0];
    if (target) {
      setLoadingPair([comp.id, target.id]);
      await Promise.resolve();

      const recipe = await findOrCreateRecipe(comp.itemName, target.itemName);
      setLoadingPair(null);
      if (recipe) {
        const craftedItemName = recipe.result;
        const craftedItemId = generateId(craftedItemName);

        const updatedItems = await getAllItems();
      setItems(updatedItems);

        const craftedItem = items().find(i => i.name === craftedItemName);
        const craftedEmote = craftedItem?.emote ?? '';

        const craftedItemPos = {
          x: (comp.pos.x + target.pos.x) / 2,
          y: (comp.pos.y + target.pos.y) / 2,
          width: 160,
          height: 50,
        };

        setComponents(prev => {
          const newComponents = prev.map(c => {
            if (c.id === comp.id || c.id === target.id) {
              return {
                ...c,
                visible: false,
              };
            }
            return c;
          });

          newComponents.push({
            id: craftedItemId,
            itemName: craftedItemName,
            emote: craftedEmote,
            pos: craftedItemPos,
            visible: true,
            isCrafted: true,
          });

          return newComponents;
        });

        setDiscovered(prev =>
          prev.includes(craftedItemName) ? prev : [...prev, craftedItemName]
        );
      }
    }
    setCraftingInProgress(false);
  };

  const spawnComponent = (itemName: string) => {
    const minX = 100, maxX = 700;
    const minY = 30, maxY = 500;
    const width = 100, height = 32;

    const randomX = Math.floor(Math.random() * (maxX - minX)) + minX;
    const randomY = Math.floor(Math.random() * (maxY - minY)) + minY;

    const id = generateId(itemName);
    // Find emote for the item
    const item = items().find(i => i.name === itemName);

    setComponents(prev => [
      ...prev,
      {
        id,
        itemName,
        emote: item?.emote ?? '',
        pos: { x: randomX, y: randomY, width, height },
        visible: true,
        isCrafted: false,
      },
    ]);
  };

  return (
    <div class={styles.app}>
      <div class={styles.sidebar}>
        <div class={styles.sidebarSearchContainer}>
          <input
            type="text"
            placeholder="Search..."
            value={search()}
            onInput={e => setSearch(e.currentTarget.value)}
            class={styles.sidebarSearchInput}
          />
        </div>
        <div class={styles.sidebarButtonsGrid}>
          <For each={discovered().filter(itemName =>
            itemName.toLowerCase().includes(search().toLowerCase())
          )}>
            {(itemName) => {
              const item = items().find(i => i.name === itemName);
              return (
                <button
                  onClick={() => spawnComponent(itemName)}
                  class={styles.sidebarButtonCompact}
                >
                  <span class={styles.sidebarEmote}>{item?.emote}</span>
                  <span class={styles.sidebarItemName}>{itemName}</span>
                  <span class={styles.sidebarEmote}>{item?.emote}</span>
                </button>
              );
            }}
          </For>
        </div>
      </div>
      <div class={styles.mainArea}>
        <div class={styles.workbench}>
          <header class={styles.header}>
            <For each={components()}>
              {(comp) => {
                let highlight = false;
                let loading = false;
                const currentTouched = touchedId();
                const pair = loadingPair();
                if (pair && (pair[0] === comp.id || pair[1] === comp.id)) {
                  loading = true;
                }
                if (currentTouched) {
                  if (comp.id === currentTouched) {
                    highlight = components().some(
                      c =>
                        c.id !== comp.id &&
                        c.visible &&
                        isOverlapping(comp.id, c.id)
                    );
                  } else if (comp.visible && isOverlapping(currentTouched, comp.id)) {
                    highlight = true;
                  }
                }
                return (
                  <Show when={comp.visible}>
                    <DraggableComponent
                      id={comp.id}
                      emote={comp.emote}
                      name={comp.itemName}
                      pos={comp.pos}
                      setPos={(newPos) => updatePosition(comp.id, newPos)}
                      highlight={highlight}
                      loading={loading}
                      onRelease={(id, x, y) => {
                        setTouchedId(null);
                        handleRelease(id, x, y);
                      }}
                      onMouseDown={() => setTouchedId(comp.id)}
                    />
                  </Show>
                );
              }}
            </For>
          </header>
        </div>
      </div>
    </div>
  );
};

export default App;
