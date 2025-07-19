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

    public T FindById(string id)
    {
        return ctx.Set<T>().First(t => t.Id == id);
    }

    public async Task UpdateAsync(T entity)
        {
            var old = FindById(entity.Id);
            foreach (var prop in typeof(T).GetProperties())
            {
                prop.SetValue(old, prop.GetValue(entity));
            }
            ctx.Set<T>().Update(old);
            await ctx.SaveChangesAsync();
        }

    public async Task DeleteByIdAsync(string id)
    {
        var entity = FindById(id);
        ctx.Set<T>().Remove(entity);
        await ctx.SaveChangesAsync();
    }
}
