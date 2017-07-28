
1 - -

dotnet new web
dotnet add package Microsoft.AspnetCore.Mvc
dotnet add package Microsoft.AspnetCore.StaticFiles

Add the things in Startup.
Structure the same
Don't forget ViewStart


2 - -

All the ComponentModel stuff is around, so you can attribute your models like crazy

For the EF stuff:

dotnet add package Microsoft.EntityFrameworkCore.SqlServer

then...
services.AddDbContext<ConferenceContext>(opt => opt.UseSqlServer(
                "Server=(localdb)\\mssqllocaldb;Database=Conferences;Trusted_Connection=True;MultipleActiveResultSets=true"));

And some init code. The DropCreate stuff is unclear whether it is available, but here is a good intro to EF stuff on dotnet core:

https://docs.microsoft.com/en-us/aspnet/core/data/ef-mvc/intro

