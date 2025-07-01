import { createSignal, Show, For } from 'solid-js';
import { type Component } from 'solid-js';
import * as styles from './App.css';
import DraggableComponent from './components/draggable_component';
import { itemEmotes, ItemType, findOrCreateRecipe, craftingRecipes } from './data/crafting';

const SIDEBAR_WIDTH = -50;

type ComponentState = {
  id: string;
  itemType: ItemType;
  image: string;
  pos: { x: number; y: number; width: number; height: number };
  visible: boolean;
  isCrafted: boolean;
};

const App: Component = () => {
  const [discovered, setDiscovered] = createSignal<ItemType[]>(['Wood', 'Stone', 'Axe', 'Pickaxe']);
  const [components, setComponents] = createSignal<ComponentState[]>([]);
  const [touchedId, setTouchedId] = createSignal<string | null>(null);
  const [loadingPair, setLoadingPair] = createSignal<[string, string] | null>(null);
  const [craftingInProgress, setCraftingInProgress] = createSignal(false);
  const [search, setSearch] = createSignal('');

  const generateId = (itemType: ItemType) => {
    const existingIds = components().filter(c => c.itemType === itemType).length;
    return `${itemType}-${existingIds + 1}`;
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

  // Synchronous helper for highlight logic
  const canCraftSync = (typeA: ItemType, typeB: ItemType) => {
    // Only check recipes already in memory (not calling Ollama)
    return (
      craftingRecipes.some(
        r =>
          (r.ingredients[0] === typeA && r.ingredients[1] === typeB) ||
          (r.ingredients[0] === typeB && r.ingredients[1] === typeA)
      ) ||
      // Check generated recipes already in memory
      // @ts-ignore
      window.generatedRecipes?.some?.(
        (r: any) =>
          (r.ingredients[0] === typeA && r.ingredients[1] === typeB) ||
          (r.ingredients[0] === typeB && r.ingredients[1] === typeA)
      )
    );
  };

  const handleRelease = async (id: string, x: number, y: number) => {
    if (craftingInProgress()) return; // Prevent concurrent crafting
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

    const releasedComp = components().find(c => c.id === id);
    if (!releasedComp) {
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
      setLoadingPair([releasedComp.id, target.id]);
      await Promise.resolve();

      const recipe = await findOrCreateRecipe(releasedComp.itemType, target.itemType);
      setLoadingPair(null);
      if (recipe) {
        const craftedItemType = recipe.result;
        const craftedItemId = generateId(craftedItemType);

        const craftedItemPos = {
          x: (releasedComp.pos.x + target.pos.x) / 2,
          y: (releasedComp.pos.y + target.pos.y) / 2,
          width: 160,
          height: 50
        };

        setComponents(prev => {
          const newComponents = prev.map(comp => {
            if (comp.id === releasedComp.id || comp.id === target.id) {
              return {
                ...comp,
                visible: false
              };
            }
            return comp;
          });

          newComponents.push({
            id: craftedItemId,
            itemType: craftedItemType,
            image: itemEmotes[craftedItemType],
            pos: craftedItemPos,
            visible: true,
            isCrafted: true
          });

          return newComponents;
        });
        setDiscovered(prev =>
          prev.includes(craftedItemType) ? prev : [...prev, craftedItemType]
        );
      }
    }
    setCraftingInProgress(false);
  };
  const spawnComponent = (itemType: ItemType) => {
    const minX = 100, maxX = 700;
    const minY = 30, maxY = 500;
    const width = 100, height = 32; // smaller size

    const randomX = Math.floor(Math.random() * (maxX - minX)) + minX;
    const randomY = Math.floor(Math.random() * (maxY - minY)) + minY;

    const id = generateId(itemType);
    setComponents(prev => [
      ...prev,
      {
        id,
        itemType,
        image: itemEmotes[itemType],
        pos: { x: randomX, y: randomY, width, height },
        visible: true,
        isCrafted: false
      }
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
          <For each={discovered().filter(item =>
            item.toLowerCase().includes(search().toLowerCase())
          )}>
            {(item) => (
              <button
                onClick={() => spawnComponent(item)}
                class={styles.sidebarButtonCompact}
              >
                <span class={styles.sidebarEmote}>{itemEmotes[item]}</span>
                <span class={styles.sidebarItemName}>{item}</span>
                <span class={styles.sidebarEmote}>{itemEmotes[item]}</span>
              </button>
            )}
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
                      emote={itemEmotes[comp.itemType]}
                      name={comp.itemType}
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



