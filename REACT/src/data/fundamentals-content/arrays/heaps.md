So far, you've solved many problems by traversing arrays, sorting data, or making greedy decisions. In several greedy problems, you probably found yourself repeatedly asking questions like:

- What's the smallest element right now?
- What's the largest element?
- Which task should I process next?
- Which meeting ends first?

Finding these answers by scanning the entire array every time works, but it's often inefficient.

This section introduces a new data structure designed specifically for these situations: the **Heap**.

A heap helps you quickly access the smallest or largest element without repeatedly searching the entire collection.

---

# Why This Section Exists

Imagine you're organizing a competition.

Players have these scores:

```text
85   92   67   98   76   88
```

After every round, you're asked:

> Who currently has the highest score?

One solution is obvious.

Search the entire array.

```text
85

92

67

98

76

88

Highest = 98
```

Easy.

Now suppose scores keep changing.

Every few seconds someone asks again.

```text
Highest?

Highest?

Highest?

Highest?
```

Do you really want to scan the entire array every single time?

Probably not.

You need something that always keeps the largest element easily accessible.

That's exactly why **Heaps** exist.

---

# The Core Idea

Imagine a pile of books.

They're not completely sorted.

```text
7

2

9

4

1
```

But suppose someone guarantees one thing:

> The largest book is always on top.

You don't know the order of everything underneath.

But whenever you need the largest one...

It's immediately available.

That's exactly how a **Max Heap** works.

Similarly,

A **Min Heap** always keeps the smallest element at the top.

You don't get a fully sorted collection.

You only get the information you usually care about most.

---

# Meet Your New Tool

There are two types of heaps you'll encounter most often.

## Max Heap

The largest element is always at the top.

```text
        98
      /    \
    92      88
   /  \    /
 76  85  67
```

Notice something.

The numbers aren't completely sorted.

For example,

```text
76

85
```

Their order doesn't matter.

The only important rule is:

> Every parent is greater than or equal to its children.

That guarantees the maximum element stays at the top.

---

## Min Heap

A Min Heap works in the opposite way.

```text
        1
      /   \
     4     2
    / \   /
   9  7  5
```

Now the smallest element is always on top.

Again,

The entire structure isn't sorted.

Only the heap property matters.

---

# Why Not Just Sort?

A common question is:

> Why not simply sort the array?

Suppose your numbers are:

```text
8 4 9 2 6
```

After sorting:

```text
2 4 6 8 9
```

Now imagine a new value arrives.

```text
5
```

You'd need to insert it while keeping everything sorted.

If numbers are constantly being added and removed, maintaining a sorted array becomes expensive.

A heap is built for exactly this kind of situation.

It allows you to efficiently:

- insert new elements,
- remove the smallest or largest,
- always know the current top element.

---

# Where Are Heaps Used?

Whenever a problem repeatedly asks questions like:

- Give me the smallest.
- Give me the largest.
- Keep track of the top **K** elements.
- Process tasks by priority.
- Always pick the next best candidate.

A heap is often the right tool.

Instead of searching the entire collection again and again, the heap keeps the answer ready for you.

---

# Using Heaps in Code

Before solving problems, let's quickly see how heaps look in different programming languages.

You don't need to memorize everything—just become familiar with the basic operations.

## C++

### Max Heap (Default)

```cpp
#include <queue>

priority_queue<int> maxHeap;
```

### Min Heap

```cpp
#include <queue>
#include <vector>

priority_queue<int, vector<int>, greater<int>> minHeap;
```

### Common Operations

```cpp
maxHeap.push(10);

maxHeap.push(5);

maxHeap.top();

maxHeap.pop();

maxHeap.empty();

maxHeap.size();
```

---

## Java

### Max Heap

```java
PriorityQueue<Integer> maxHeap =
    new PriorityQueue<>(Collections.reverseOrder());
```

### Min Heap (Default)

```java
PriorityQueue<Integer> minHeap =
    new PriorityQueue<>();
```

### Common Operations

```java
minHeap.offer(10);

minHeap.offer(5);

minHeap.peek();

minHeap.poll();

minHeap.isEmpty();

minHeap.size();
```

---

## Python

```python
import heapq

heap = []
```

Python provides a **Min Heap** by default.

### Common Operations

```python
heapq.heappush(heap, 10)

heapq.heappush(heap, 5)

heap[0]

heapq.heappop(heap)

len(heap)
```

For a **Max Heap**, you'll usually insert negative values.

```python
heapq.heappush(heap, -10)
```

---

# Quick Cheat Sheet

| Operation | C++ | Java | Python |
|-----------|------|------|--------|
| Create Min Heap | `priority_queue<..., greater<>>` | `PriorityQueue<>()` | `heap = []` |
| Create Max Heap | `priority_queue<>` | `Collections.reverseOrder()` | Store negative values |
| Insert | `push()` | `offer()` | `heappush()` |
| Get Top | `top()` | `peek()` | `heap[0]` |
| Remove Top | `pop()` | `poll()` | `heappop()` |
| Size | `size()` | `size()` | `len()` |

These are all you'll need for the beginner and intermediate heap problems in this roadmap.

---

# What You'll Practice

The problems in this section gradually introduce:

- finding the **K** largest elements,
- finding the **K** smallest elements,
- Top K Frequent Elements,
- merging sorted structures,
- streaming problems,
- maintaining medians,
- combining heaps with greedy algorithms.

Although the stories differ, they all revolve around one central idea:

> **Efficiently maintain the most important element.**

---

# When Should a Heap Come to Mind?

As you read a problem, look for clues like:

- ✅ Find the largest **K** elements.
- ✅ Find the smallest **K** elements.
- ✅ Continuously insert new values.
- ✅ Process tasks by priority.
- ✅ Always choose the minimum or maximum available element.
- ✅ The data changes over time while queries continue.

These are strong signs that a heap might be the perfect tool.

---

# Don't Think of a Heap as a Sorted Array

This is probably the biggest misconception beginners have.

A heap is **not** a sorted collection.

For example,

```text
        10
      /    \
     7      8
    / \
   3   5
```

This is a perfectly valid Max Heap.

Notice

```text
7

8
```

aren't sorted.

That's okay.

The only guarantee is that the top element is always the maximum.

Everything else is arranged only enough to maintain that property.

---

# Common Beginner Mistakes

As you solve problems in this section, watch out for these common mistakes:

- Thinking a heap stores elements in sorted order.
- Using sorting when repeated insertions and removals are required.
- Confusing Min Heap with Max Heap.
- Forgetting that Python's `heapq` implements a Min Heap by default.
- Searching through the heap instead of using its top element.

Remember, a heap is designed to quickly answer one question:

> **"What's the current smallest (or largest) element?"**

---

# Before You Start Solving Problems

Heaps are one of the most practical data structures in DSA because they solve a very common problem: efficiently keeping track of the "best" element while the data is constantly changing. You don't need to know the internal array representation or heapify process yet. Those implementation details can come later.

For now, focus on recognizing when a heap is useful.

As you work through the problems, keep asking yourself:

> **"Am I repeatedly searching for the smallest or largest element?"**

If the answer is yes, there's a good chance a heap can make your solution much more efficient.

---

# One More Thing to Keep in Mind

A heap is usually visualized as a **Binary Tree**.

```text
        5
      /   \
     8     12
    / \   /
  15 20 18
```

But internally, it is stored as a simple array.

```text
Index:  0   1   2   3   4   5

Value: [5, 8, 12, 15, 20, 18]
```

A heap is conceptually viewed as a binary tree, but in almost all programming languages, it's implemented internally using a simple array.