---
title: "Someone closes your console, stopping you from doing any cleanup?"
layout: post
tags: [dotnet, TrivadisContent]
date: 2008-03-31 16:19:52
redirect_from: /go/117/
---

Fair enough, production code is unlikely to be running in a cute .NET Console App, but maybe you come into a situation where you at least want to prevent somebody from closing your console window without going through your lovely cleanup routines. This [link here](http://www.msnewsgroups.net/group/microsoft.public.dotnet.languages.csharp/topic10229.aspx) will tell you what you can do.

To spread the word and to have a slightly less wordy version (using e.g. already defined delegates), you may also just look here:

`

        [DllImport("Kernel32")]
        private static extern bool SetConsoleCtrlHandler(Func<CtrlType, bool> handler, bool add);

        enum CtrlType
        {
            CTRL_C_EVENT = 0,
            CTRL_BREAK_EVENT = 1,
            CTRL_CLOSE_EVENT = 2,
            CTRL_LOGOFF_EVENT = 5,
            CTRL_SHUTDOWN_EVENT = 6
        }

        private static bool Handler(CtrlType sig)
        {
            if (sig == CtrlType.CTRL_CLOSE_EVENT)
                 //DoCleanup stuff here
            return false;
        }

        static void Main(string[] args)
        {
            // Some boilerplate to react to close window event
            SetConsoleCtrlHandler(Handler, true);
            ....
`

"Handler" is just interested in the close event. It returns a boolean that states whether the given _Close_-message is handled. If you e.g. are letting your Console App hang around with _Console.ReadLine()_ you better return that the event is not handled yet. That way, whatever routines are in place from .NET to handle the blocking _Console_-call will also be executed. If you would set handled = true, your App is essentially locked and Windows will ask you to end the process.