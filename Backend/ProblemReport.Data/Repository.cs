using System;
using ProblemReport.Entities.Helper;

namespace ProblemReport.Data;

public class Repository<T> where T : class, IIdentity
{
    ProblemReportContext ctx;

    public Repository(ProblemReportContext ctx)
    {
        this.ctx = ctx;
    }

    public async Task CreateAsync(T entity)
    {
        ctx.Set<T>().Add(entity);
        await ctx.SaveChangesAsync();
    }

    public IQueryable<T> GetAll()
    {
        return ctx.Set<T>();
    }

    public T? FindById(string id)
    {
        return ctx.Set<T>().FirstOrDefault(t => t.Id == id);
    }

    public async Task DeleteByIdAsync(string id)
    {
        var entity = FindById(id);
        ctx.Set<T>().Remove(entity);
        await ctx.SaveChangesAsync();
    }
}
