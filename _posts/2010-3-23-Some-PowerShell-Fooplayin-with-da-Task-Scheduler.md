---
title: "Some PowerShell Foo...playin' with da Task Scheduler"
layout: post
tags: powershell
date: 2010-03-23 04:43:00
redirect_from: "/go/164"
---

When adopting something new it can take quite a while until you really get into it. PowerShell is such a thing. When it came out I played around with it, not more. Now, with us having to provide some maintenance tools for our last project and me working on connecting Powershell to MSBuild, things look different. PowerShell feels like a Swiss army knife.

Just today we had an update issue on our Continuous Integration server. There are several tasks running via the Task Scheduler. When they run, the respective dlls cannot be updated. One way to solve this is to ensure that during the nightly build no task is running.

Powershell to the rescue.

Let’s get access to the Task Scheduler API and connect to the local Task Scheduler Service:
 <div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:3902e8b5-6755-4cc8-98ba-82ddc01fe154" class="wlWriterEditableSmartContent"><pre name="code" class="c#">$ST = new-object -com("Schedule.Service")
$ST.Connect()</pre></div>

Our tasks are located at the root and follow a certain name pattern

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:7cbf29b7-e7b7-43bc-8a2f-c95e8fa2613c" class="wlWriterEditableSmartContent"><pre name="code" class="c#:nocontrols">$tasks = $ST.GetFolder("\").GetTasks(0) | where { $_.Enabled -eq $true -and $_.Name.StartsWith("Some.Pattern") }</pre></div>

Tasks are obviously objects with properties and methods, hence we may just want to look at their names

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:317ff2b2-155b-497b-88bd-103771fe468e" class="wlWriterEditableSmartContent"><pre name="code" class="c#:nocontrols">$tasks | select name</pre></div>

Now, we can just disable them.

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:cdfee294-8966-4110-b2bb-af29e170090d" class="wlWriterEditableSmartContent"><pre name="code" class="c#:nocontrols">$tasks | foreach { $_.Enabled = $false }</pre></div>

Or we actually want to figure out if any task is currently running:

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:bb915a87-34cf-4fc1-9f66-3a156438c0c2" class="wlWriterEditableSmartContent"><pre name="code" class="c#:nocontrols">$ST.GetFolder("\").GetTasks(0) | where {$_.State -eq 4}
</pre></div>

Pack this all in and kick it off as a task and presto, you can disable and enable registered tasks without much hassle.

Second work site today: Administering the DB behind my website. With the SQLServer Commandlets one can very quickly create functions that are tailored to certain things:

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:84c0338b-bd67-483b-a08a-322d8be6558f" class="wlWriterEditableSmartContent"><pre name="code" class="c#:nocontrols">function Invoke-Sql([string]$query) {
  Invoke-Sqlcmd -ServerInstance $Server -Database $DB -User $User -Password $Password -Query $query
}
</pre></div>

and then for example

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:812469c5-0cb0-4c63-8c15-c81123a09de7:660079fe-4633-4387-9af9-057d75264419" class="wlWriterEditableSmartContent"><pre name="code" class="c#:nocontrols">function Insert-Tags($tags) {
  $tags | foreach { Invoke-Sql "insert into thingy (col1, col2, created) values ('$_', '$_', GETDATE())" }
}
</pre></div>

Sometimes it’s good to have an army knife.