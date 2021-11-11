export default function List({ items, remove, toggle }) {
  return (
    <ul>
      {items.map((item) => {
        return (
          <li key={item.id}>
            <span
              onClick={() => (toggle ? toggle(item) : null)}
              style={{ textDecoration: item.done ? "line-through" : "none" }}
            >
              {item.name}
            </span>
            <button onClick={(e) => remove(item)}>X</button>
          </li>
        );
      })}
    </ul>
  );
}
