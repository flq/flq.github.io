---
title: "Haskell decision making"
layout: post
tags: [software-development, haskell]
date: 2007-05-30 19:59:22
redirect_from: /go/90/
---

A few days ago, while I was implementing something in PL/SQL for that dreaded Oracle Forms project I had to code some scary if-else construct spanning two logic checks that depending on the combination gave four different results. 

`
if a=true and b=true then 1
elsif a=true and b=false then 2
elsif a=false and b=true then ... 
`

Back in the train on the way home I had a look if my limited Haskell knowledge could come up with something nicer.

This post presents the first version of such a program that tries to give an answer. It is likely that other posts may refer back to this, once my brain has digested e.g. this ['Random hack'](http://www.randomhacks.net/articles/2007/03/12/monads-in-15-minutes).

Let us start with the type definitions, logic constraints and result data:

`type Input = Int ; type Output = Int
type PosX = Int; type PosY = Int; type DecisionOutput = Bool
type DecisionTuple = (PosY,PosX,DecisionOutput)
type Decider = [(Input->DecisionOutput)]
data Solution = Solution [DecisionTuple] Output

deciderGates :: [Decider]
deciderGates = 
    [
        [\x -> x < 75, \x -> x `within` (75,80), \x -> x > 80],
        [\x -> x == 1, \x -> x == 0]
    ]

solutions :: [Solution]
solutions = [
        Solution [(0,0,True),(1,1,True)] 34,
        Solution [(0,1,True),(1,1,True)] 30,
        Solution [(0,0,True),(1,0,True)] 28,
        Solution [(0,1,True),(1,1,True)] 25,
        Solution [(0,2,True)] 1,
        Solution [] 0
    ]

result (Solution _ r) = r
`

This is the lengthiest part of the code which is just fine since it lays out what we want to do.

The idea behind the whole thing is that we start off with an array of Inputs. We then have an array of **Deciders**. Such a decider is a collection of functions that take an input and produce a result. The **deciderGates** contain several such lines. Each line is meant to be applied to one of the inputs contained in the input array. Hence, the first input enters the first gate, the second the second, and so on.

The atomic decisions contained in those gates may also be addressed in XY coordinates (we have an array of arrays of decisions). The remainder of the program will consider Y to be going down and X to the right.

The **solutions** data encodes solutions in that way. **DecisionTuples** are used to constrain what the **decidergates** should output for a certain desired return value. The first solution says that the decision at position 0,0 should be true as well as the one at position 1,1. If you now check DecisionTuple's type
you should see how this is meant. The conditions x < 75 and x == 0 have to be met in order to return the result 34. If you
think that this will never happen consider that the decision gates are applied to different inputs. Accordingly, the input [11,0] will satisfy the outlined conditions. The function that provides said answer looks like this:

`
solve :: [Input] -> Output
solve = find 0 . solutionGateEvaluation . decisionYX 0 . callDeciders
`

Looks simple, doesn't it? Let us look at the functions that compose it:

`
callDeciders :: [Input] -> [[DecisionOutput]]
callDeciders input = zipWith call input deciderGates
    where call input checks = map (\check -> check input) checks
`

**zipWith** is used here to zip together the input with said deciderGates. Just a reminder of zipWith's type: 
**zipWith :: (a -> b -> c) -> [a] -> [b] -> [c]**.

Each **deciderGate **is an array of decisions that all need to be called with the input that is relevant in the context of the zipWith. We do this calling with a **map**. Hence this function will end up with the same array structure as the deciderGates, only that those decisions are now evaluated with the provided input.

Next stop is to convert the obtained solutions to a different representation, one that is compatible to the YX-coordinate decision tuples that are laid out in the solutions array.

`
decisionYX :: Int -> [[DecisionOutput]] -> [[DecisionTuple]]
decisionYX _ [] = []
decisionYX l (x:xs)= (zip3 (repeat l) [0..]) x : decisionYX (l+1) xs
`

Here some pattern matching is used to separate out the first element of the incoming array. In other words, in **x** we will find an array of decision outputs. This we can zip together with some numbers that represent our YX coordinates. Lazy evaluation is our friend here. While **repeat 1** gives us an infinite array of 1s, the list [0..] is basically the set of natural numbers. Of course, since **x** is finite,
we have no trouble with those. The remaining stuff is treated the same way as the first element, only that the Y counter goes up, which is just what I coded. What we will have now is an array of decision tuple arrays - that's already quite close to the things encoded in the solutions.

Let us make the final evaluation and see which of the solutions manages to match to our decision outputs:

`
solutionGateEvaluation :: [[DecisionTuple]] -> [[Bool]]
solutionGateEvaluation decTuplesFromCall = map compareSolnWithCall solutions
    where compareSolnWithCall (Solution decTuplesFromSoln _) = 
        zipWith elem decTuplesFromSoln decTuplesFromCall
`

Here we look at every single solution via map. We then zip together the array of tuples for a single solution with the array of arrays of decision tuples from having called the decider gates. We do this with the built-in **elem** function that returns true if the first argument is found in the array that the second argument must be (**elem :: (Eq a) => a -> [a] -> Bool**).

As an example, if I pipe in the inputs [11,0], I first get this structure:

`
> callDeciders [11,0]
[[True,False,False],[False,True]]
`

Which is transformed to

`
[[(0,0,True),(0,1,False),(0,2,False)],[(1,0,False),(1,1,True)]]
`

This is what gets zipped together with the solutions. The first array only refers to stuff from the first gate, etc. For the solutions we have to **assume** that only **one DecisionTuple** is present for a Y coordinate and that they are specified in the same order as the gates. Consequently, the **solutionGateEvaluation** has this result:

`
[[True,True],[False,True],[True,False],[False,True],[False],[]]
`

For the first solution ([(0,0,True),(1,1,True)]) the code asks:

`
Is (0,0,True) element of [(0,0,True),(0,1,False),(0,2,False)] ? Yes!
Is (1,1,True) element of [(1,0,False),(1,1,True)] ? Yes!
Hence [True,True].
`

There are as many arrays as there are solutions (of course, that's how often we called **zipWith**). Guess where we find our solution..? It's the first one that returns true from all of its elements.

`
find l solnEvals
    | l > (length solnEvals) - 1 = error "No available solution"
    | and (solnEvals!!l) = result (solutions!!l)
    | otherwise = find (l+1) solnEvals
`  

Here the in-built **and** is applied to an array while the **l** counts for us at which index we are looking. With the **l**-index we can simply pick out the solution with the **result** function that is already defined.

This solution isn't too bad. The single problem that may be perceived is that all inputs must be of the same type for now. The nice thing is that you have the decisions clearly separated from the solutions clearly separated from the implementation of the evaluation. Also, at a first glance the implementation relies on the fact that we can compare things to each other. A future version may show how the implementation can be made so generic that exactly this statement and not more is encapsulated. For now you could just change the type definitions on top of the program.

Clearly, other languages allow you to do similar degrees of separating concerns, but here you can do it in a few lines of code, providing a great blueprint for other languages.