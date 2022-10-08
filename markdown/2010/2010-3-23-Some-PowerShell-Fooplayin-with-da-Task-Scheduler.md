---
title: "Some PowerShell Foo...playin' with da Task Scheduler"
layout: post
tags: [tools]
date: 2010-03-23 04:43:00
---

When adopting something new it can take quite a while until you really get into it. PowerShell is such a thing. When it came out I played around with it, not more. Now, with us having to provide some maintenance tools for our last project and me working on connecting Powershell to MSBuild, things look different. PowerShell feels like a Swiss army knife.

Just today we had an update issue on our Continuous Integration server. There are several tasks running via the Task Scheduler. When they run, the respective dlls cannot be updated. One way to solve this is to ensure that during the nightly build no task is running.

Powershell to the rescue.

Let’s get access to the Task Scheduler API and connect to the local Task Scheduler Service:

```csharp 
$ST = new-object -com("Schedule.Service")
$ST.Connect()
```

Our tasks are located at the root and follow a certain name pattern

```powershell
$tasks = $ST.GetFolder("\").GetTasks(0) | 
  where { $_.Enabled -eq $true -and $_.Name.StartsWith("Some.Pattern") }
```

Tasks are obviously objects with properties and methods, hence we may want to look at their names

```powershell
$tasks | select name</pre></div>
```

Now, we can disable them.

```powershell
$tasks | foreach { $_.Enabled = $false }
```

Or we actually want to figure out if any task is currently running:


```powershell
$ST.GetFolder("\").GetTasks(0) | where {$_.State -eq 4}
```

Pack this all in and kick it off as a task and presto, you can disable and enable registered tasks without much hassle.

Second work site today: Administering the DB behind my website. With the SQLServer Commandlets one can very quickly create functions that are tailored to certain things:



```powershell
function Invoke-Sql([string]$query) {
  Invoke-Sqlcmd -ServerInstance $Server -Database $DB -User $User -Password $Password -Query $query
}
```


and then for example

```powershell
function Insert-Tags($tags) {
  $tags | foreach { Invoke-Sql "insert into thingy (col1, col2, created) values ('$_', '$_', GETDATE())" }
}
```

Sometimes it’s good to have an army knife.