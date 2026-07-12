So far, every problem you've solved has involved a single row of elements.

```text
2   5   1   8   4
```

You moved left and right.

You searched, sorted, rotated, and processed one dimension at a time.

In this section, you'll take the next step.

Instead of working with a single row, you'll work with multiple rows and columns, forming what we call a **2D Array** or **Matrix**.

Although it looks more complex at first, you'll soon realize that it's simply an extension of everything you've already learned.

---

## Why This Section Exists

Imagine a classroom.

Instead of arranging students in a single line...

```text
A  B  C  D  E
```

they sit in rows and columns.

```text
A  B  C
D  E  F
G  H  I
```

Now if someone asks,

> Where is **E**?

You can no longer answer using a single index.

You need two positions.

```text
(Row, Column)
```

That's exactly what a matrix is.

Every element is identified by:

```text
matrix[row][column]
```

Instead of moving in one direction, you'll now move in two.

---

## The Core Idea

Think of a matrix as an array where every element is another array.

Instead of

```text
[2, 5, 1, 8]
```

you now have

```text
[
  [2, 5, 1],
  [7, 3, 9],
  [4, 6, 8]
]
```

Visually,

```text
          Col
        0   1   2

Row
0       2   5   1
1       7   3   9
2       4   6   8
```

Every element is located using

```text
(row, column)
```

For example,

```text
matrix[1][2]
```

means

```text
Row = 1
Column = 2

Answer = 9
```

---

## A New Way of Thinking

Before this section, your thinking was usually:

> "Move left or right."

Now your thinking becomes:

> "Which row am I in? Which column am I in?"

Every movement now happens in one of four directions.

```text
      ↑

←     X     →

      ↓
```

As you solve problems, you'll constantly move:

- up
- down
- left
- right

Many advanced problems also involve diagonal movement, but you'll encounter those later.

---

## Rows vs Columns

One of the biggest beginner mistakes is confusing rows and columns.

Think of it this way.

### Rows go across

```text
1 2 3
```

### Columns go down

```text
1
2
3
```

So in

```text
1 2 3
4 5 6
7 8 9
```

The **second row** is

```text
4 5 6
```

The **second column** is

```text
2
5
8
```

Keeping this distinction clear makes matrix problems much easier.

---

## Visualizing Traversal

Just like arrays, matrices can be traversed in many different ways.

### Row-wise Traversal

```text
1 → 2 → 3
↓
4 → 5 → 6
↓
7 → 8 → 9
```

### Column-wise Traversal

```text
1
↓
4
↓
7

→

2
↓
5
↓
8

→

3
↓
6
↓
9
```

### Spiral Traversal

```text
1 → 2 → 3
        ↓
4     5 ↓
↑       ↓
7 ← 8 ← 9
```

### Diagonal Traversal

```text
1
  2
3
    4
```

You'll gradually encounter these different traversal patterns throughout this section.

---

## Matrices Aren't Just About Traversal

Many beginners think matrix problems are simply about visiting every cell.

But matrices introduce several new ideas.

Sometimes you'll:

- modify rows
- modify columns
- rotate the matrix
- search efficiently
- simulate movement
- mark cells in place

Although the stories change, the matrix itself is always the main object you're working with.

---

## What You'll Practice

The problems in this section gradually teach you how to:

- traverse matrices
- modify rows and columns
- rotate matrices
- transpose matrices
- perform in-place transformations
- simulate movement inside a grid
- search efficiently in sorted matrices

You'll also notice connections with earlier sections.

Some matrix problems use:

- Prefix Sum
- Binary Search
- Simulation
- Hashing

The matrix simply provides a new environment for applying familiar techniques.

---

## Using 2D Arrays in Code

Before solving problems, let's quickly see how matrices look in different languages.

### C++

```cpp
vector<vector<int>> matrix = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

// Access an element
matrix[1][2];   // 6
```

### Java

```java
int[][] matrix = {
    {1,2,3},
    {4,5,6},
    {7,8,9}
};

// Access
matrix[1][2];
```

### Python

```python
matrix = [
    [1,2,3],
    [4,5,6],
    [7,8,9]
]

# Access
matrix[1][2]
```

---

## Quick Cheat Sheet

| Task | C++ | Java | Python |
|------|------|------|---------|
| Create Matrix | `vector<vector<int>>` | `int[][]` | `list of lists` |
| Access Cell | `matrix[r][c]` | `matrix[r][c]` | `matrix[r][c]` |
| Number of Rows | `matrix.size()` | `matrix.length` | `len(matrix)` |
| Number of Columns | `matrix[0].size()` | `matrix[0].length` | `len(matrix[0])` |

These are all you'll need for the problems in this section.

---

## When Should 2D Arrays Come to Mind?

As you read a problem, watch for clues like:

- ✅ The input is a matrix or grid.
- ✅ The problem mentions rows and columns.
- ✅ You need to move up, down, left, or right.
- ✅ The task involves rotating or transforming a matrix.
- ✅ You're working with images, game boards, spreadsheets, or maps.

These are all classic signs of matrix problems.

---

## Common Beginner Mistakes

As you solve this section, try to avoid these common mistakes:

- Confusing rows with columns.
- Mixing up `matrix[row][column]`.
- Forgetting to check matrix boundaries before moving.
- Assuming every matrix problem is just traversal.
- Treating a matrix as something completely different from an array.

Remember, a matrix is simply an array of arrays. Most of the techniques you've already learned still apply—you just have one extra dimension to think about.

---

# Before You Start Solving Problems

2D Arrays may look intimidating at first because the data is arranged differently, but the underlying ideas are surprisingly familiar. Think of each row as its own array, then learn how those rows fit together into a grid. Drawing the matrix on paper and tracing your movement with arrows is one of the best ways to build intuition.

As you solve the upcoming problems, keep asking yourself:

> **"If this were a normal array, what would I do? How does adding another dimension change that?"**

That mindset will help you transfer the skills you've already built into the world of matrices.

---

> 💡 **Notice how many earlier techniques reappeared in matrices.**
>
> Arrays taught you the building blocks—traversal, searching, hashing, binary search, heaps, and prefix sums. Matrices don't replace those ideas; they simply apply them in two dimensions.
>
> As your roadmap continues, you'll keep reusing these same techniques in even richer data structures like **Trees** and **Graphs**.