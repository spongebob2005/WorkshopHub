# Sample Learning Materials - Example Content

This file shows what students will see when they access learning materials for each workshop.

---

## Workshop: Advanced React Patterns & Best Practices
**Price:** $89.99 | **Instructor:** Sarah Johnson

### Study Modules Tab

#### Module 1: Advanced Hooks Architecture - useCallback, useMemo, useRef Deep Dive
*Description: Understand the performance implications of React hooks and when to use each optimization technique.*

Key Topics:
- useCallback for memoizing function definitions
- useMemo for expensive calculations
- useRef for mutable references
- Hook dependencies and closure traps
- Performance measurement with DevTools

#### Module 2: Context API & Performance
*Focus: Building scalable state management without re-rendering all consumers.*

Key Topics:
- Context API fundamentals
- Consumer re-render issues and solutions
- useContext optimization patterns
- Splitting contexts for performance
- Context vs Redux trade-offs

#### Module 3: Custom Hooks Patterns
*Learn to extract and reuse stateful logic across components.*

Key Topics:
- Writing custom hooks
- Hook composition
- Sharing logic between components
- Testing custom hooks
- Documentation best practices

#### Module 4: Render Props & Higher Order Components
*Alternative patterns for code reuse before hooks.*

Key Topics:
- Render props pattern
- Higher order components (HOCs)
- When to use each pattern
- Combining patterns
- Migration from class components

#### Module 5: State Management Strategies
*Compare Redux, Zustand, Recoil and choose the right tool.*

Key Topics:
- Redux architecture (actions, reducers, store)
- Zustand minimal approach
- Recoil atoms and selectors
- Performance and bundle size considerations
- Real-world case studies

#### Module 6: Performance Optimization
*Building fast React applications.*

Key Topics:
- Code splitting and lazy loading
- Building profiler analysis
- memo() and React.lazy()
- Virtual scrolling for large lists
- Lighthouse optimization

#### Module 7: Architecture Patterns
*Structuring large React applications.*

Key Topics:
- Component composition strategies
- Folder structure
- Separation of concerns
- Testing architecture
- Scaling apps to 1000+ components

#### Module 8: Real-world Applications
*Putting it all together - building production applications.*

Key Topics:
- Authentication patterns
- Error boundaries
- Loading states and suspense
- Analytics integration
- Monitoring and debugging

---

### Practice & Quiz Tab

#### Question 1 of 6
**What hook should you use for memoizing expensive calculations?**

Options:
- [ ] useEffect
- [x] useMemo
- [ ] useState
- [ ] useContext

**Correct!** ✅

**Explanation:**
useMemo memoizes the computed value and only recomputes when dependencies change. This is perfect for expensive calculations like filtering large arrays or complex math.

- **useEffect** is for side effects (API calls, subscriptions)
- **useState** is for managing component state
- **useContext** is for consuming context values

Use useMemo when:
- Calculation is expensive (takes >1ms)
- Component re-renders frequently
- Dependency array is stable

Example:
```javascript
const sortedList = useMemo(
  () => items.sort((a, b) => a.price - b.price),
  [items]
);
```

---

#### Question 2 of 6
**When using useCallback, what is the primary purpose?**

Options:
- [x] To memoize function definitions
- [ ] To prevent infinite loops
- [ ] To cache function results
- [ ] To manage component lifecycle

**Correct!** ✅

**Explanation:**
useCallback memoizes the function definition itself so it maintains referential equality across renders. This prevents unnecessary re-renders of child components that depend on the function.

Why this matters:
```javascript
// WITHOUT useCallback - new function each render
const handleClick = () => { /* ... */ };
<Button onClick={handleClick} /> // Button re-renders!

// WITH useCallback - same function reference
const handleClick = useCallback(() => { /* ... */ }, []);
<Button onClick={handleClick} /> // Button doesn't re-render
```

Key difference from useMemo:
- **useMemo**: Caches computed VALUES
- **useCallback**: Caches FUNCTION DEFINITIONS

Usage:
- Pass to memoized child components
- As dependency in useEffect
- Passing callbacks to external libraries

---

#### Question 3 of 6
**What is the main drawback of using Context API directly for global state?**

Options:
- [ ] It doesn't support async operations
- [x] All consumers re-render when context changes
- [ ] It requires more boilerplate than useState
- [ ] It can't store complex objects

**Correct!** ✅

**Explanation:**
When a Context value changes, ALL components consuming that context re-render, even if they only use a small part of the state. This can significantly hurt performance in large applications.

Example of the problem:
```javascript
// User context with 20 properties
const UserContext = createContext();

// Component only needs username
function UserCard() {
  const { username } = useContext(UserContext); // Re-renders on ANY property change!
  return <div>{username}</div>;
}

// If user.theme changes, UserCard re-renders even though it doesn't use theme
```

Solutions:
1. **Split contexts** - Separate into UserDataContext, UserThemeContext, etc.
2. **Use useMemo** - Memoize context values to prevent unnecessary renders
3. **Use state management library** - Redux/Zustand only re-render components using specific state
4. **Selector hooks** - Create custom hooks that only select needed data

---

#### Question 4 of 6
**Which pattern is best for sharing complex state management logic across multiple components?**

Options:
- [ ] Prop drilling
- [x] Custom Hooks
- [ ] Class components with inheritance
- [ ] Global variables

**Correct!** ✅

**Explanation:**
Custom hooks allow you to extract and reuse stateful logic across components cleanly. They enable better code organization, testability, and maintainability.

Why custom hooks win:
```javascript
// BEFORE: Logic scattered across components
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    fetch('/api/users')
      .then(r => r.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);
  
  return loading ? <Spinner /> : <div>{users.map(...)}</div>;
}

// AFTER: Logic extracted into custom hook
function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    fetch('/api/users')
      // ...
  }, []);
  
  return { users, loading };
}

function UserList() {
  const { users, loading } = useUsers();
  return loading ? <Spinner /> : <div>{users.map(...)}</div>;
}

function UserTable() {
  const { users } = useUsers(); // Reuse everywhere!
  return <table>{users.map(...)}</table>;
}
```

Benefits:
- Reusability across components
- Testability
- Composition
- Better naming intent
- Easier refactoring

---

#### Question 5 of 6
**In a Render Props pattern, what is passed as a prop to enable dynamic component rendering?**

Options:
- [ ] A component class
- [x] A function that returns JSX
- [ ] An array of elements
- [ ] A string describing the component

**Correct!** ✅

**Explanation:**
The Render Props pattern uses a function prop that the component calls to render its output. This gives the parent component control over what gets rendered while the child manages state/logic.

Pattern structure:
```javascript
// The render prop is a function
<Parent render={(data) => <Child data={data} />} />

// Or with children as render function
<Parent>
  {(data) => <Child data={data} />}
</Parent>
```

Real-world example (before hooks):
```javascript
function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return render(position);
}

// Usage
<MouseTracker render={(pos) => (
  <div>Mouse is at {pos.x}, {pos.y}</div>
)} />
```

When to use:
- Sharing behavior between components
- Controlled rendering logic
- (Note: Now often replaced by custom hooks, but still useful in some cases)

---

#### Question 6 of 6
**What tool would you use to analyze and identify performance bottlenecks in a React application?**

Options:
- [ ] Redux DevTools
- [x] React DevTools Profiler
- [ ] Browser DevTools Console
- [ ] Webpack analyzer

**Correct!** ✅

**Explanation:**
React DevTools Profiler shows how long components take to render and which components are being re-rendered unnecessarily. It's essential for performance optimization analysis.

How to use it:
1. Install React DevTools browser extension
2. Go to Components tab → Profiler tab
3. Click record button
4. Interact with app
5. View results showing:
   - Component render time
   - Number of re-renders
   - Which components updated
   - Why components updated

Reading the output:
```
ComponentName (15.2ms)
  └─ ChildComponent (8.5ms) - Updated because parent re-rendered
  └─ ListItem (2.3ms) - No update
  └─ Button [Memoized] (0.1ms) - Skipped re-render due to memo()
```

Using the insights:
- **High render time?** Optimize complex logic
- **Frequent re-renders?** Check if memoization is needed
- **Re-rendering children?** Wrap with React.memo()

Other profiling tools:
- **Lighthouse** - Web performance metrics
- **Chrome DevTools Performance tab** - Browser-level metrics
- **React Strict Mode** - Development warnings
- **Bundle analyzer** - JavaScript bundle size

---

### Resources Tab

#### Video Tutorials

1. **Advanced React Hooks Deep Dive**
   https://www.youtube.com/watch?v=dpw9EHDh2bM

2. **React Performance Optimization Strategies**
   https://www.youtube.com/watch?v=0ZKhLFjpmVs

3. **State Management Patterns Comparison**
   https://www.youtube.com/watch?v=XFxF4ET8RlI

4. **Custom Hooks Patterns Tutorial**
   https://www.youtube.com/watch?v=J0asqNaIj_w

5. **Render Props Pattern Explained**
   https://www.youtube.com/watch?v=r6Tcyw4alys

#### Reading Materials

1. **React Hooks API Reference & Patterns**
   https://react.dev/reference/react
   *Official React documentation with interactive examples*

2. **Performance Optimization Techniques in React**
   https://react.dev/reference/react/useMemo
   *Comprehensive guide with use cases and best practices*

3. **State Management Architecture Guide**
   https://react.dev/learn/managing-state
   *How to structure state in complex applications*

4. **Custom Hooks & Logic Extraction**
   https://react.dev/learn/reusing-logic-with-custom-hooks
   *Building reusable hooks with examples*

5. **Testing React Components & Hooks**
   https://testing-library.com/docs/react-testing-library/intro/
   *Best practices for testing React code*

---

## What Students Experience

### Before Registration
```
┌─────────────────────────────────────┐
│   Advanced React Patterns Workshop   │
│   By Sarah Johnson                   │
├─────────────────────────────────────┤
│                                     │
│   About This Workshop               │
│   Learn advanced React patterns...  │
│                                     │
│   Skills You'll Learn               │
│   • React                           │
│   • JavaScript                      │
│                                     │
│   [🔒] Learning Materials (Locked)  │
│   Register for this workshop to     │
│   unlock tutorials, MCQs, PDFs,     │
│   and videos.                       │
│                                     │
│   [Register Now →]                  │
└─────────────────────────────────────┘
```

### After Registration & Payment
```
┌──────────────────────────────────────┐
│  Advanced React Patterns Workshop    │
│  By Sarah Johnson                    │
├──────────────────────────────────────┤
│                                      │
│ [Study Modules] [Practice] [Resources]
│                                      │
│ Study Modules:                       │
│ ─────────────────────────────────    │
│  1 Advanced Hooks Architecture       │
│  2 Context API & Performance         │
│  3 Custom Hooks Patterns             │
│  4 Render Props & HOCs               │
│  5 State Management Strategies       │
│  6 Performance Optimization          │
│  7 Architecture Patterns             │
│  8 Real-world Applications           │
│                                      │
│ Practice & Quiz:                     │
│ ─────────────────────────────────    │
│  Question 1 of 6                     │
│  What hook should you use for...     │
│  ☑ useMemo                           │
│  [Detailed explanation shown]        │
│                                      │
│ Resources:                           │
│ ─────────────────────────────────    │
│  Videos (5):                         │
│  • Advanced React Hooks Deep Dive    │
│  • React Performance Optimization    │
│                                      │
│  Reading Materials (5):              │
│  • React Hooks API Reference         │
│  • Performance Optimization Guide    │
│                                      │
└──────────────────────────────────────┘
```

---

## Learning Outcomes

After completing this workshop's learning materials, students will:
- ✅ Understand advanced React hooks internals
- ✅ Optimize React applications for performance
- ✅ Build reusable custom hooks
- ✅ Compare state management approaches
- ✅ Design scalable React architectures
- ✅ Implement professional patterns
- ✅ Debug and profile React apps
- ✅ Build production-ready applications

---

This is the quality and depth of learning materials provided for **all 6 workshops** in the system!
