import { useEffect, useState } from "react";

// ─── API helpers ───────────────────────────────────────────────────────────────

const api = {
  post: (url, body) =>
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => r.json()),

  put: (url, body) =>
    fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => r.json()),

  delete: (url) => fetch(url, { method: "DELETE" }).then((r) => r.json()),
};

// ─── Reusable form field components ────────────────────────────────────────────

function Field({ label, hint, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 12, color: "var(--clr-muted)", fontWeight: 500 }}>
        {label}
      </label>
      {children}
      {hint && <span style={{ fontSize: 12, color: "var(--clr-muted)" }}>{hint}</span>}
    </div>
  );
}

function Input({ id, state, setState, ...props }) {
  return (
    <input
      value={state[id] || ""}
      onChange={(e) => setState((s) => ({ ...s, [id]: e.target.value }))}
      {...props}
    />
  );
}

function Select({ id, state, setState, options }) {
  return (
    <select
      value={state[id] || ""}
      onChange={(e) => setState((s) => ({ ...s, [id]: e.target.value }))}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function Textarea({ id, state, setState, ...props }) {
  return (
    <textarea
      value={state[id] || ""}
      onChange={(e) => setState((s) => ({ ...s, [id]: e.target.value }))}
      rows={3}
      {...props}
    />
  );
}

function Row({ children, full }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: full ? "1fr" : "1fr 1fr",
        gap: 12,
        marginBottom: 12,
      }}
    >
      {children}
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="card">
      <p className="card-title">{title}</p>
      {children}
    </div>
  );
}

function BtnRow({ children }) {
  return <div style={{ display: "flex", gap: 8, marginTop: 4 }}>{children}</div>;
}

// ─── Toast ─────────────────────────────────────────────────────────────────────

let toastTimer;
function useToast() {
  const [toast, setToast] = useState(null);
  const show = (msg, type = "success") => {
    setToast({ msg, type });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => setToast(null), 3000);
  };
  return [toast, show];
}

// ─── Panels ────────────────────────────────────────────────────────────────────

function UsersPanel({ toast }) {
  const [ins, setIns] = useState({ role: "user" });
  const [upd, setUpd] = useState({ role: "" });
  const [del, setDel] = useState({});

  const doInsert = async () => {
    if (!ins.username || !ins.email || !ins.password) return toast("Fill all required fields.", "error");
    const res = await api.post("/api/users", ins);
    res.success ? toast(`User added (ID: ${res.user_id})`) : toast(res.error, "error");
  };

  const doUpdate = async () => {
    if (!upd.id) return toast("Enter a User ID.", "error");
    const { id, ...fields } = upd;
    const res = await api.put(`/api/users/${id}`, fields);
    res.success ? toast("User updated.") : toast(res.error, "error");
  };

  const doDelete = async () => {
    if (!del.id) return toast("Enter a User ID.", "error");
    const res = await api.delete(`/api/users/${del.id}`);
    res.success ? toast("User deleted.") : toast(res.error, "error");
  };

  return (
    <>
      <Card title="Insert new user">
        <Row>
          <Field label="Username *"><Input id="username" state={ins} setState={setIns} placeholder="chef_mario" /></Field>
          <Field label="Email *"><Input id="email" type="email" state={ins} setState={setIns} placeholder="mario@example.com" /></Field>
        </Row>
        <Row>
          <Field label="Password *"><Input id="password" type="password" state={ins} setState={setIns} placeholder="••••••••" /></Field>
          <Field label="Role"><Select id="role" state={ins} setState={setIns} options={[{ value: "user", label: "User" }, { value: "admin", label: "Admin" }, { value: "moderator", label: "Moderator" }]} /></Field>
        </Row>
        <BtnRow><button className="btn btn-primary" onClick={doInsert}>Insert</button></BtnRow>
      </Card>

      <Card title="Update user">
        <Row full><Field label="User ID"><Input id="id" state={upd} setState={setUpd} placeholder="e.g. 3" /></Field></Row>
        <Row>
          <Field label="New username"><Input id="username" state={upd} setState={setUpd} placeholder="leave blank to keep" /></Field>
          <Field label="New email"><Input id="email" state={upd} setState={setUpd} placeholder="leave blank to keep" /></Field>
        </Row>
        <Row full>
          <Field label="New role">
            <Select id="role" state={upd} setState={setUpd} options={[{ value: "", label: "-- no change --" }, { value: "user", label: "User" }, { value: "admin", label: "Admin" }, { value: "moderator", label: "Moderator" }]} />
          </Field>
        </Row>
        <BtnRow><button className="btn" onClick={doUpdate}>Update</button></BtnRow>
      </Card>

      <Card title="Delete user">
        <Row full><Field label="User ID" hint="Cascades to recipes owned by this user."><Input id="id" state={del} setState={setDel} placeholder="e.g. 3" /></Field></Row>
        <BtnRow><button className="btn btn-danger" onClick={doDelete}>Delete</button></BtnRow>
      </Card>
    </>
  );
}

function RecipesPanel({ toast }) {
  const [ins, setIns] = useState({});
  const [upd, setUpd] = useState({});
  const [del, setDel] = useState({});

  const doInsert = async () => {
    if (!ins.user_id || !ins.title) return toast("User ID and title are required.", "error");
    const res = await api.post("/api/recipes", ins);
    res.success ? toast(`Recipe added (ID: ${res.recipe_id})`) : toast(res.error, "error");
  };

  const doUpdate = async () => {
    if (!upd.id) return toast("Enter a Recipe ID.", "error");
    const { id, ...fields } = upd;
    const res = await api.put(`/api/recipes/${id}`, fields);
    res.success ? toast("Recipe updated.") : toast(res.error, "error");
  };

  const doDelete = async () => {
    if (!del.id) return toast("Enter a Recipe ID.", "error");
    const res = await api.delete(`/api/recipes/${del.id}`);
    res.success ? toast("Recipe deleted.") : toast(res.error, "error");
  };

  return (
    <>
      <Card title="Insert new recipe">
        <Row>
          <Field label="User ID (author) *"><Input id="user_id" state={ins} setState={setIns} placeholder="e.g. 1" /></Field>
          <Field label="Title *"><Input id="title" state={ins} setState={setIns} placeholder="Pasta Carbonara" /></Field>
        </Row>
        <Row full><Field label="Description"><Textarea id="description" state={ins} setState={setIns} placeholder="Short description..." /></Field></Row>
        <Row full><Field label="Instructions"><Textarea id="instructions" state={ins} setState={setIns} placeholder="Step 1: ..." /></Field></Row>
        <Row>
          <Field label="Prep time (min)"><Input id="prep_time" type="number" state={ins} setState={setIns} placeholder="15" /></Field>
          <Field label="Cook time (min)"><Input id="cook_time" type="number" state={ins} setState={setIns} placeholder="30" /></Field>
        </Row>
        <Row full><Field label="Servings"><Input id="servings" type="number" state={ins} setState={setIns} placeholder="4" /></Field></Row>
        <BtnRow><button className="btn btn-primary" onClick={doInsert}>Insert</button></BtnRow>
      </Card>

      <Card title="Update recipe">
        <Row full><Field label="Recipe ID"><Input id="id" state={upd} setState={setUpd} placeholder="e.g. 5" /></Field></Row>
        <Row>
          <Field label="New title"><Input id="title" state={upd} setState={setUpd} placeholder="leave blank to keep" /></Field>
          <Field label="Servings"><Input id="servings" type="number" state={upd} setState={setUpd} placeholder="leave blank" /></Field>
        </Row>
        <Row>
          <Field label="Prep time"><Input id="prep_time" type="number" state={upd} setState={setUpd} placeholder="leave blank" /></Field>
          <Field label="Cook time"><Input id="cook_time" type="number" state={upd} setState={setUpd} placeholder="leave blank" /></Field>
        </Row>
        <BtnRow><button className="btn" onClick={doUpdate}>Update</button></BtnRow>
      </Card>

      <Card title="Delete recipe">
        <Row full><Field label="Recipe ID"><Input id="id" state={del} setState={setDel} placeholder="e.g. 5" /></Field></Row>
        <BtnRow><button className="btn btn-danger" onClick={doDelete}>Delete</button></BtnRow>
      </Card>
    </>
  );
}

function SimplePanel({ toast, label, endpoint, pkField, pkLabel, fields }) {
  const [ins, setIns] = useState({});
  const [upd, setUpd] = useState({});
  const [del, setDel] = useState({});

  const doInsert = async () => {
    const res = await api.post(`/api/${endpoint}`, ins);
    res.success ? toast(`${label} added (ID: ${res[pkField]})`) : toast(res.error, "error");
  };

  const doUpdate = async () => {
    if (!upd.id) return toast(`Enter a ${pkLabel}.`, "error");
    const { id, ...rest } = upd;
    const res = await api.put(`/api/${endpoint}/${id}`, rest);
    res.success ? toast(`${label} updated.`) : toast(res.error, "error");
  };

  const doDelete = async () => {
    if (!del.id) return toast(`Enter a ${pkLabel}.`, "error");
    const res = await api.delete(`/api/${endpoint}/${del.id}`);
    res.success ? toast(`${label} deleted.`) : toast(res.error, "error");
  };

  return (
    <>
      <Card title={`Insert ${label.toLowerCase()}`}>
        <Row>
          {fields.map((f) => (
            <Field key={f.id} label={f.label}>
              <Input id={f.id} state={ins} setState={setIns} placeholder={f.placeholder} />
            </Field>
          ))}
        </Row>
        <BtnRow><button className="btn btn-primary" onClick={doInsert}>Insert</button></BtnRow>
      </Card>

      <Card title={`Update ${label.toLowerCase()}`}>
        <Row full><Field label={pkLabel}><Input id="id" state={upd} setState={setUpd} placeholder="e.g. 1" /></Field></Row>
        <Row>
          {fields.map((f) => (
            <Field key={f.id} label={`New ${f.label.toLowerCase()}`}>
              <Input id={f.id} state={upd} setState={setUpd} placeholder="leave blank to keep" />
            </Field>
          ))}
        </Row>
        <BtnRow><button className="btn" onClick={doUpdate}>Update</button></BtnRow>
      </Card>

      <Card title={`Delete ${label.toLowerCase()}`}>
        <Row full><Field label={pkLabel}><Input id="id" state={del} setState={setDel} placeholder="e.g. 1" /></Field></Row>
        <BtnRow><button className="btn btn-danger" onClick={doDelete}>Delete</button></BtnRow>
      </Card>
    </>
  );
}

function ReviewsPanel({ toast }) {
  const [ins, setIns] = useState({});
  const [upd, setUpd] = useState({});
  const [del, setDel] = useState({});

  const doInsert = async () => {
    if (!ins.recipe_id || !ins.user_id) return toast("Recipe ID and User ID are required.", "error");
    const res = await api.post("/api/reviews", ins);
    res.success ? toast(`Review added (ID: ${res.review_id})`) : toast(res.error, "error");
  };

  const doUpdate = async () => {
    if (!upd.id) return toast("Enter a Review ID.", "error");
    const { id, ...fields } = upd;
    const res = await api.put(`/api/reviews/${id}`, fields);
    res.success ? toast("Review updated.") : toast(res.error, "error");
  };

  const doDelete = async () => {
    if (!del.id) return toast("Enter a Review ID.", "error");
    const res = await api.delete(`/api/reviews/${del.id}`);
    res.success ? toast("Review deleted.") : toast(res.error, "error");
  };

  return (
    <>
      <Card title="Insert review">
        <Row>
          <Field label="Recipe ID *"><Input id="recipe_id" state={ins} setState={setIns} placeholder="e.g. 5" /></Field>
          <Field label="User ID *"><Input id="user_id" state={ins} setState={setIns} placeholder="e.g. 2" /></Field>
        </Row>
        <Row full><Field label="Comment"><Textarea id="comment" state={ins} setState={setIns} placeholder="Great recipe!" /></Field></Row>
        <Row full><Field label="Rating (1–5)"><Input id="rating" type="number" min={1} max={5} state={ins} setState={setIns} placeholder="5" /></Field></Row>
        <BtnRow><button className="btn btn-primary" onClick={doInsert}>Insert</button></BtnRow>
      </Card>

      <Card title="Update review">
        <Row full><Field label="Review ID"><Input id="id" state={upd} setState={setUpd} placeholder="e.g. 8" /></Field></Row>
        <Row full><Field label="New comment"><Textarea id="comment" state={upd} setState={setUpd} placeholder="leave blank to keep" /></Field></Row>
        <Row full><Field label="New rating (1–5)"><Input id="rating" type="number" min={1} max={5} state={upd} setState={setUpd} placeholder="leave blank" /></Field></Row>
        <BtnRow><button className="btn" onClick={doUpdate}>Update</button></BtnRow>
      </Card>

      <Card title="Delete review">
        <Row full><Field label="Review ID"><Input id="id" state={del} setState={setDel} placeholder="e.g. 8" /></Field></Row>
        <BtnRow><button className="btn btn-danger" onClick={doDelete}>Delete</button></BtnRow>
      </Card>
    </>
  );
}

function CollectionsPanel({ toast }) {
  const [ins, setIns] = useState({ privacy_status: "private" });
  const [upd, setUpd] = useState({ privacy_status: "" });
  const [del, setDel] = useState({});

  const doInsert = async () => {
    if (!ins.user_id || !ins.title) return toast("User ID and title are required.", "error");
    const res = await api.post("/api/collections", ins);
    res.success ? toast(`Collection added (ID: ${res.collection_id})`) : toast(res.error, "error");
  };

  const doUpdate = async () => {
    if (!upd.id) return toast("Enter a Collection ID.", "error");
    const { id, ...fields } = upd;
    const res = await api.put(`/api/collections/${id}`, fields);
    res.success ? toast("Collection updated.") : toast(res.error, "error");
  };

  const doDelete = async () => {
    if (!del.id) return toast("Enter a Collection ID.", "error");
    const res = await api.delete(`/api/collections/${del.id}`);
    res.success ? toast("Collection deleted.") : toast(res.error, "error");
  };

  return (
    <>
      <Card title="Insert collection">
        <Row>
          <Field label="User ID *"><Input id="user_id" state={ins} setState={setIns} placeholder="e.g. 1" /></Field>
          <Field label="Title *"><Input id="title" state={ins} setState={setIns} placeholder="Weeknight Dinners" /></Field>
        </Row>
        <Row>
          <Field label="Description"><Input id="description" state={ins} setState={setIns} placeholder="optional" /></Field>
          <Field label="Privacy"><Select id="privacy_status" state={ins} setState={setIns} options={[{ value: "private", label: "Private" }, { value: "public", label: "Public" }]} /></Field>
        </Row>
        <Row full><Field label="Shared with (user IDs, comma-separated)"><Input id="shared_with" state={ins} setState={setIns} placeholder="e.g. 2,5,9" /></Field></Row>
        <BtnRow><button className="btn btn-primary" onClick={doInsert}>Insert</button></BtnRow>
      </Card>

      <Card title="Update collection">
        <Row full><Field label="Collection ID"><Input id="id" state={upd} setState={setUpd} placeholder="e.g. 3" /></Field></Row>
        <Row>
          <Field label="New title"><Input id="title" state={upd} setState={setUpd} placeholder="leave blank to keep" /></Field>
          <Field label="New privacy"><Select id="privacy_status" state={upd} setState={setUpd} options={[{ value: "", label: "-- no change --" }, { value: "private", label: "Private" }, { value: "public", label: "Public" }]} /></Field>
        </Row>
        <BtnRow><button className="btn" onClick={doUpdate}>Update</button></BtnRow>
      </Card>

      <Card title="Delete collection">
        <Row full><Field label="Collection ID"><Input id="id" state={del} setState={setDel} placeholder="e.g. 3" /></Field></Row>
        <BtnRow><button className="btn btn-danger" onClick={doDelete}>Delete</button></BtnRow>
      </Card>
    </>
  );
}

function RecipeIngredientPanel({ toast }) {
  const [ins, setIns] = useState({});
  const [upd, setUpd] = useState({});
  const [del, setDel] = useState({});

  const doInsert = async () => {
    if (!ins.recipe_id || !ins.ingredient_id) return toast("Both IDs are required.", "error");
    const res = await api.post("/api/recipe-ingredients", ins);
    res.success ? toast("Link added.") : toast(res.error, "error");
  };

  const doUpdate = async () => {
    if (!upd.recipe_id || !upd.ingredient_id) return toast("Both IDs are required.", "error");
    const { recipe_id, ingredient_id, ...fields } = upd;
    const res = await api.put(`/api/recipe-ingredients/${recipe_id}/${ingredient_id}`, fields);
    res.success ? toast("Link updated.") : toast(res.error, "error");
  };

  const doDelete = async () => {
    if (!del.recipe_id || !del.ingredient_id) return toast("Both IDs are required.", "error");
    const res = await api.delete(`/api/recipe-ingredients/${del.recipe_id}/${del.ingredient_id}`);
    res.success ? toast("Link deleted.") : toast(res.error, "error");
  };

  return (
    <>
      <Card title="Insert recipe–ingredient link">
        <Row>
          <Field label="Recipe ID *"><Input id="recipe_id" state={ins} setState={setIns} placeholder="e.g. 5" /></Field>
          <Field label="Ingredient ID *"><Input id="ingredient_id" state={ins} setState={setIns} placeholder="e.g. 2" /></Field>
        </Row>
        <Row>
          <Field label="Quantity"><Input id="quantity" state={ins} setState={setIns} placeholder="e.g. 200" /></Field>
          <Field label="Unit"><Input id="unit" state={ins} setState={setIns} placeholder="e.g. grams" /></Field>
        </Row>
        <BtnRow><button className="btn btn-primary" onClick={doInsert}>Insert</button></BtnRow>
      </Card>

      <Card title="Update quantity / unit">
        <Row>
          <Field label="Recipe ID *"><Input id="recipe_id" state={upd} setState={setUpd} placeholder="e.g. 5" /></Field>
          <Field label="Ingredient ID *"><Input id="ingredient_id" state={upd} setState={setUpd} placeholder="e.g. 2" /></Field>
        </Row>
        <Row>
          <Field label="New quantity"><Input id="quantity" state={upd} setState={setUpd} placeholder="leave blank to keep" /></Field>
          <Field label="New unit"><Input id="unit" state={upd} setState={setUpd} placeholder="leave blank to keep" /></Field>
        </Row>
        <BtnRow><button className="btn" onClick={doUpdate}>Update</button></BtnRow>
      </Card>

      <Card title="Delete link">
        <Row>
          <Field label="Recipe ID *"><Input id="recipe_id" state={del} setState={setDel} placeholder="e.g. 5" /></Field>
          <Field label="Ingredient ID *"><Input id="ingredient_id" state={del} setState={setDel} placeholder="e.g. 2" /></Field>
        </Row>
        <BtnRow><button className="btn btn-danger" onClick={doDelete}>Delete</button></BtnRow>
      </Card>
    </>
  );
}

// ─── Nav config ────────────────────────────────────────────────────────────────

const NAV = [
  { id: "users", label: "Users" },
  { id: "recipes", label: "Recipes" },
  { id: "ingredients", label: "Ingredients" },
  { id: "reviews", label: "Reviews" },
  {
    id: "lookups", label: "Lookups ▾",
    children: [
      { id: "categories", label: "Categories" },
      { id: "dietary", label: "Dietary flags" },
      { id: "cuisines", label: "Cuisines" },
    ],
  },
  {
    id: "relations", label: "Relations ▾",
    children: [
      { id: "collections", label: "Collections" },
      { id: "recipe_ingredient", label: "Recipe ingredients" },
    ],
  },
];

// ─── Main App ──────────────────────────────────────────────────────────────────

export default function App() {
  const [dbStatus, setDbStatus] = useState(null);
  const [active, setActive] = useState("users");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [toast, showToast] = useToast();

  useEffect(() => {
    fetch("/api/db-status")
      .then((r) => r.json())
      .then(setDbStatus)
      .catch(() => setDbStatus({ connected: false, error: "Could not reach server" }));
  }, []);

  const panelTitle = {
    users: "Users", recipes: "Recipes", ingredients: "Ingredients",
    reviews: "Reviews", categories: "Categories", dietary: "Dietary flags",
    cuisines: "Cuisines", collections: "Recipe collections",
    recipe_ingredient: "Recipe ingredients",
  };

  const panelSub = {
    users: "Insert, update, or delete user accounts.",
    recipes: "Manage recipe records.",
    ingredients: "Manage the ingredient lookup table.",
    reviews: "Add, edit, or remove recipe reviews.",
    categories: "Manage recipe category lookup values.",
    dietary: "Manage dietary flag values (e.g. Vegan, Gluten-Free).",
    cuisines: "Manage cuisine lookup values.",
    collections: "Manage user-created recipe collections.",
    recipe_ingredient: "Link ingredients to recipes with quantity and unit.",
  };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --clr-bg: #f8f7f4;
          --clr-surface: #ffffff;
          --clr-border: rgba(0,0,0,0.1);
          --clr-border-strong: rgba(0,0,0,0.2);
          --clr-text: #1a1a1a;
          --clr-muted: #6b6b6b;
          --clr-accent: #2d6a4f;
          --clr-accent-light: #e8f5e9;
          --clr-danger: #c0392b;
          --clr-danger-light: #fdecea;
          --radius: 8px;
          --radius-lg: 12px;
        }
        body { font-family: 'Georgia', serif; background: var(--clr-bg); color: var(--clr-text); font-size: 14px; }
        input, select, textarea, button { font-family: 'Georgia', serif; font-size: 13px; }
        input, select, textarea {
          padding: 7px 10px; border-radius: var(--radius);
          border: 0.5px solid var(--clr-border-strong);
          background: var(--clr-surface); color: var(--clr-text); outline: none; width: 100%;
        }
        input:focus, select:focus, textarea:focus {
          border-color: var(--clr-accent); box-shadow: 0 0 0 3px rgba(45,106,79,0.1);
        }
        textarea { resize: vertical; }
        .btn {
          padding: 7px 16px; border-radius: var(--radius);
          border: 0.5px solid var(--clr-border-strong);
          background: transparent; cursor: pointer; color: var(--clr-text);
          transition: background 0.12s;
        }
        .btn:hover { background: #f0f0f0; }
        .btn-primary { background: var(--clr-accent); color: #fff; border-color: var(--clr-accent); }
        .btn-primary:hover { background: #245a42; }
        .btn-danger { color: var(--clr-danger); border-color: rgba(192,57,43,0.3); }
        .btn-danger:hover { background: var(--clr-danger-light); }
        .card {
          background: var(--clr-surface); border: 0.5px solid var(--clr-border);
          border-radius: var(--radius-lg); padding: 1.25rem; margin-bottom: 1rem;
        }
        .card-title {
          font-size: 11px; font-weight: bold; color: var(--clr-muted);
          letter-spacing: .07em; text-transform: uppercase; margin-bottom: 1rem;
          font-family: sans-serif;
        }
        /* Navbar */
        .topbar {
          background: var(--clr-surface); border-bottom: 0.5px solid var(--clr-border);
          padding: 0 2rem; display: flex; align-items: center; gap: 2rem; height: 52px;
          position: sticky; top: 0; z-index: 100;
        }
        .brand { font-size: 18px; font-weight: bold; letter-spacing: -.02em; color: var(--clr-accent); white-space: nowrap; }
        .db-badge {
          font-size: 11px; padding: 3px 8px; border-radius: 20px;
          font-family: sans-serif;
        }
        .db-badge.ok { background: var(--clr-accent-light); color: var(--clr-accent); }
        .db-badge.err { background: var(--clr-danger-light); color: var(--clr-danger); }
        .nav-links { display: flex; align-items: center; gap: 2px; }
        .nav-btn {
          padding: 6px 12px; border-radius: var(--radius); font-size: 13px;
          cursor: pointer; border: none; background: transparent; color: var(--clr-muted);
          transition: background 0.12s, color 0.12s; white-space: nowrap; font-family: sans-serif;
        }
        .nav-btn:hover { background: #f0f0f0; color: var(--clr-text); }
        .nav-btn.active { background: var(--clr-accent-light); color: var(--clr-accent); font-weight: bold; }
        .dropdown-wrap { position: relative; }
        .dropdown {
          display: none; position: absolute; top: calc(100% + 4px); left: 0;
          background: var(--clr-surface); border: 0.5px solid var(--clr-border);
          border-radius: var(--radius-lg); min-width: 170px; z-index: 200; padding: 6px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        }
        .dropdown-wrap.open .dropdown { display: block; }
        .dd-item {
          display: block; width: 100%; text-align: left; padding: 7px 10px;
          border-radius: var(--radius); font-size: 13px; cursor: pointer;
          border: none; background: transparent; color: var(--clr-text); font-family: sans-serif;
        }
        .dd-item:hover { background: #f0f0f0; }
        /* Layout */
        .layout { display: flex; min-height: calc(100vh - 52px); }
        .panel-wrap { flex: 1; padding: 2rem; overflow-y: auto; }
        .panel-title { font-size: 20px; font-weight: bold; margin-bottom: 4px; }
        .panel-sub { font-size: 13px; color: var(--clr-muted); margin-bottom: 1.5rem; font-family: sans-serif; }
        /* Toast */
        .toast {
          position: fixed; bottom: 1.5rem; right: 1.5rem; padding: 10px 18px;
          border-radius: var(--radius); font-size: 13px; border: 0.5px solid;
          z-index: 999; font-family: sans-serif; transition: opacity 0.2s;
        }
        .toast.success { background: var(--clr-accent-light); color: var(--clr-accent); border-color: rgba(45,106,79,0.3); }
        .toast.error { background: var(--clr-danger-light); color: var(--clr-danger); border-color: rgba(192,57,43,0.3); }
      `}</style>

      {/* Navbar */}
      <div className="topbar">
        <div className="brand">RecipeDB</div>
        <nav className="nav-links">
          {NAV.map((item) =>
            item.children ? (
              <div
                key={item.id}
                className={`dropdown-wrap ${openDropdown === item.id ? "open" : ""}`}
                onMouseEnter={() => setOpenDropdown(item.id)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button className={`nav-btn ${item.children.some(c => c.id === active) ? "active" : ""}`}>
                  {item.label}
                </button>
                <div className="dropdown">
                  {item.children.map((c) => (
                    <button key={c.id} className="dd-item" onClick={() => { setActive(c.id); setOpenDropdown(null); }}>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <button
                key={item.id}
                className={`nav-btn ${active === item.id ? "active" : ""}`}
                onClick={() => setActive(item.id)}
              >
                {item.label}
              </button>
            )
          )}
        </nav>
        {dbStatus && (
          <span className={`db-badge ${dbStatus.connected ? "ok" : "err"}`}>
            {dbStatus.connected ? "DB connected" : "DB disconnected"}
          </span>
        )}
      </div>

      {/* Main content */}
      <div className="layout">
        <div className="panel-wrap" style={{ maxWidth: 680, margin: "0 auto" }}>
          <div className="panel-title">{panelTitle[active]}</div>
          <div className="panel-sub">{panelSub[active]}</div>

          {active === "users" && <UsersPanel toast={showToast} />}
          {active === "recipes" && <RecipesPanel toast={showToast} />}
          {active === "ingredients" && (
            <SimplePanel toast={showToast} label="Ingredient" endpoint="ingredients"
              pkField="ingredient_id" pkLabel="Ingredient ID"
              fields={[{ id: "name", label: "Name", placeholder: "e.g. Parmesan" }, { id: "description", label: "Description", placeholder: "optional" }]} />
          )}
          {active === "reviews" && <ReviewsPanel toast={showToast} />}
          {active === "categories" && (
            <SimplePanel toast={showToast} label="Category" endpoint="categories"
              pkField="category_id" pkLabel="Category ID"
              fields={[{ id: "name", label: "Name", placeholder: "e.g. Dessert" }, { id: "description", label: "Description", placeholder: "optional" }]} />
          )}
          {active === "dietary" && (
            <SimplePanel toast={showToast} label="Dietary flag" endpoint="dietary-flags"
              pkField="flag_id" pkLabel="Flag ID"
              fields={[{ id: "name", label: "Name", placeholder: "e.g. Vegan" }, { id: "description", label: "Description", placeholder: "optional" }]} />
          )}
          {active === "cuisines" && (
            <SimplePanel toast={showToast} label="Cuisine" endpoint="cuisines"
              pkField="cuisine_id" pkLabel="Cuisine ID"
              fields={[{ id: "name", label: "Name", placeholder: "e.g. Italian" }, { id: "description", label: "Description", placeholder: "optional" }]} />
          )}
          {active === "collections" && <CollectionsPanel toast={showToast} />}
          {active === "recipe_ingredient" && <RecipeIngredientPanel toast={showToast} />}
        </div>
      </div>

      {/* Toast */}
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </>
  );
}