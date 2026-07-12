You've now spent time reading arrays, modifying them, and becoming comfortable with how elements and indices work together. Many of the problems you've solved so far could be completed by carefully traversing the array or rearranging its elements.

But sooner or later, you'll run into a problem where simply scanning the array over and over starts to feel wasteful.

This section introduces your first major optimization technique in DSA: **Hashing**.

Unlike the previous sections, hashing isn't about changing the array. It's about remembering information so you don't have to search for it again.

---

# Why This Section Exists

Imagine someone asks you:

- Does the number **42** exist in this array?

A simple approach is to scan the array until you either find it or reach the end.

Now imagine they ask:

- Does **15** exist?
- Does **91** exist?
- Does **42** exist?
- Does **7** exist?
- How many times does each number appear?

If you search the entire array every single time, you're repeating the same work over and over again.

Hashing solves this by remembering useful information while you're already traversing the array.

Instead of repeatedly asking the array, you build a quick reference that already knows the answers.

---

# The Core Idea

Think of hashing as creating a lookup table.

Imagine you're taking attendance in a classroom.

Instead of checking every seat whenever someone asks,

> "Is Rahul present?"

you first prepare a register.

```text
Rahul  → Present
Ankit  → Present
Priya  → Absent
Neha   → Present
```

Now answering the question takes almost no effort.

That's exactly what hashing does.

It spends a little memory to save a lot of repeated work.

---

# A New Tool: HashMap & HashSet

Until now, you've solved every problem using only arrays.

This is the first section where you'll start using another data structure.

There are two you'll use most often.

## HashMap

A **HashMap** stores information in **key → value** pairs.

Think of it as a dictionary.

```text
Apple  → 5
Banana → 2
Orange → 8
```

The key helps you find the associated value quickly.

In array problems:

- the key is usually an array element,
- the value is often its frequency, index, or some other useful information.

For example:

**Array**

```text
4 2 4 7 2 4
```

**HashMap**

```text
4 → 3
2 → 2
7 → 1
```

Instead of counting every time you need the frequency of **4**, you've already stored it.

---

## HashSet

A **HashSet** is even simpler.

It only stores unique values.

```text
Seen

4
9
12
15
```

There's no value associated with each element.

It simply answers questions like:

- Have I seen this before?
- Does this value exist?
- Is this element unique?

---

# Using HashMaps & HashSets in Code

Before solving problems, let's quickly see how these data structures look in different programming languages.

Don't worry about memorizing every function. You'll naturally become comfortable with them after solving a few problems.

## C++

```cpp
#include <unordered_map>
#include <unordered_set>

unordered_map<int, int> freq;
unordered_set<int> seen;
```

**Common operations:**

```cpp
freq[5]++;                  // Increase frequency
freq[10] = 3;               // Store a value

seen.insert(5);

if(seen.count(5)){
    // 5 exists
}

seen.erase(5);
```

---

## Java

```java
import java.util.HashMap;
import java.util.HashSet;

HashMap<Integer, Integer> freq = new HashMap<>();
HashSet<Integer> seen = new HashSet<>();
```

**Common operations:**

```java
freq.put(5, freq.getOrDefault(5, 0) + 1);

seen.add(5);

if(seen.contains(5)){
    // exists
}

seen.remove(5);
```

---

## Python

```python
freq = {}
seen = set()
```

**Common operations:**

```python
freq[5] = freq.get(5, 0) + 1

seen.add(5)

if 5 in seen:
    pass

seen.remove(5)
```

---

# Quick Cheat Sheet

| Operation | C++ | Java | Python |
|-----------|-----|------|--------|
| Create HashMap | `unordered_map<int,int>` | `HashMap<Integer,Integer>` | `{}` |
| Create HashSet | `unordered_set<int>` | `HashSet<Integer>` | `set()` |
| Insert | `map[key]=value` | `put()` | `dict[key]=value` |
| Increase Frequency | `map[x]++` | `put(x,getOrDefault()+1)` | `dict[x]=dict.get(x,0)+1` |
| Search Key | `count()` | `containsKey()` | `in` |
| Search Set | `count()` | `contains()` | `in` |
| Delete | `erase()` | `remove()` | `del` / `remove()` |

You won't need much more than these operations for the problems in this section.

---

# A Different Way to Think

Until now, your mindset was:

> "If I need information, I'll search the array."

Now it becomes:

> "If I might need this information again, I'll store it while I'm already visiting the array."

This is one of the biggest mindset shifts in DSA.

You're no longer just processing data—you’re building a memory of what you've seen.

---

# What You'll Practice

The problems in this section usually involve questions like:

- How many times does something appear?
- Have I seen this element before?
- Is there a duplicate?
- Which value is missing?
- Can I quickly look something up instead of searching every time?

Whenever you notice yourself scanning the same array repeatedly for the same information, ask yourself:

> "Can I remember this instead?"

Very often, the answer is yes.

---

# Don't Worry About How Hashing Works Internally

You might wonder:

> "How does a HashMap find things so quickly?"

That's a great question.

But right now, it's not an important one.

You don't need to understand hash functions, collisions, buckets, or resizing before solving beginner hashing problems.

Just like you can drive a car without knowing how its engine works, you can use a HashMap effectively without understanding its internal implementation.

You'll appreciate those details much more once you've used hashing in real problems.

---

# Common Beginner Mistakes

As you work through this section, try to avoid these common habits:

- Using a HashMap when a simple traversal is enough.
- Forgetting what you're storing as the value.
- Confusing keys with values.
- Storing unnecessary information.
- Trying to force hashing into every problem after learning it.

Remember, hashing is a powerful tool—but it's only one tool in your toolkit.

---

# Before You Start Solving Problems

This is your first encounter with a technique that makes problems faster by using extra memory. As you solve each problem, pay attention to moments where you think, *"I've already seen this before."* Those are exactly the situations hashing was designed for.

Don't worry about mastering HashMaps immediately. Focus on understanding **why** you're storing information, not just **how** to store it. Once that intuition clicks, you'll start recognizing hashing opportunities in many different problems.