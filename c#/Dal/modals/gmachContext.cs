using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace DAL.modals
{
    public partial class gmachContext : DbContext
    {
        public gmachContext()
        {
        }

        public gmachContext(DbContextOptions<gmachContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Customer> Customers { get; set; } = null!;
        public virtual DbSet<Gmach> Gmaches { get; set; } = null!;
        public virtual DbSet<GmachKind> GmachKinds { get; set; } = null!;
        public virtual DbSet<Order> Orders { get; set; } = null!;
        public virtual DbSet<OrdersProduct> OrdersProducts { get; set; } = null!;
        public virtual DbSet<Product> Products { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Customer>(entity =>
            {
                entity.HasKey(e => e.CustEmail)
                    .HasName("PK__Customer__BFD2B31FEBC1F241");

                entity.ToTable("Customer");

                entity.Property(e => e.CustEmail)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("custEmail");

                entity.Property(e => e.CustName)
                    .HasMaxLength(15)
                    .HasColumnName("custName");

                entity.Property(e => e.CustPasswword).HasColumnName("custPasswword");

                entity.Property(e => e.CustPhone).HasColumnName("custPhone");
            });

            modelBuilder.Entity<Gmach>(entity =>
            {
                entity.HasKey(e => e.GmachCode)
                    .HasName("PK__Gmach__23A239E6F1B5F603");

                entity.ToTable("Gmach");

                entity.Property(e => e.GmachCode).HasColumnName("gmach_code");

                entity.Property(e => e.Comments)
                    .HasMaxLength(50)
                    .HasColumnName("comments");

                entity.Property(e => e.GmachAddrres)
                    .HasMaxLength(200)
                    .HasColumnName("gmachAddrres");

                entity.Property(e => e.GmachKindCode).HasColumnName("gmachKindCode");

                entity.Property(e => e.GmachName)
                    .HasMaxLength(30)
                    .HasColumnName("gmachName");

                entity.Property(e => e.GmachPhone).HasColumnName("gmachPhone");

                entity.Property(e => e.GmachPikadon)
                    .HasColumnName("gmachPikadon")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.GmachTimes)
                    .HasMaxLength(40)
                    .HasColumnName("gmachTimes");

                entity.Property(e => e.NumDays).HasColumnName("numDays");

                entity.Property(e => e.CustEmail)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("custEmail");

                entity.HasOne<Customer>()
                    .WithMany()
                    .HasForeignKey(e => e.CustEmail)
                    .IsRequired(false)
                    .HasConstraintName("FK_Gmach_Customer_custEmail");

                entity.HasOne(d => d.GmachKindCodeNavigation)
                    .WithMany(p => p.Gmaches)
                    .HasForeignKey(d => d.GmachKindCode)
                    .HasConstraintName("FK__Gmach__gmachKind__3A81B327");
            });

            modelBuilder.Entity<GmachKind>(entity =>
            {
                entity.HasKey(e => e.GmachKindCode)
                    .HasName("PK__GmachKin__70294521CA1C5254");

                entity.ToTable("GmachKinds");

                entity.Property(e => e.GmachKindCode).HasColumnName("gmachKindCode");

                entity.Property(e => e.GmachTypes)
                    .HasMaxLength(10)
                    .HasColumnName("gmachTypes");

                entity.Property(e => e.Pic).HasColumnName("pic");
            });

            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(e => e.OrdersCode)
                    .HasName("PK__orders__8C51B15B85074EE6");

                entity.ToTable("orders");

                entity.Property(e => e.OrdersCode).HasColumnName("ordersCode");

                entity.Property(e => e.CustEmail)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("custEmail");

                entity.Property(e => e.DateTaken)
                    .HasColumnType("date")
                    .HasColumnName("dateTaken");

                entity.Property(e => e.OrderStatus)
                    .HasColumnName("orderStatus")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.ReturnDate)
                    .HasColumnType("date")
                    .HasColumnName("returnDate");

                entity.HasOne(d => d.CustEmailNavigation)
                    .WithMany(p => p.Orders)
                    .HasForeignKey(d => d.CustEmail)
                    .HasConstraintName("FK__orders__custEmai__4222D4EF");
            });

            modelBuilder.Entity<OrdersProduct>(entity =>
            {
                entity.HasKey(e => e.OrdersProductCode)
                    .HasName("PK__ordersPr__44FFA3A6045F28F9");

                entity.ToTable("ordersProducts");

                entity.Property(e => e.OrdersProductCode).HasColumnName("ordersProductCode");

                entity.Property(e => e.Comments)
                    .HasMaxLength(50)
                    .HasColumnName("comments");

                entity.Property(e => e.CountP).HasColumnName("countP");

                entity.Property(e => e.OrderCode).HasColumnName("orderCode");

                entity.Property(e => e.ProductCode).HasColumnName("productCode");

                entity.HasOne(d => d.OrderCodeNavigation)
                    .WithMany(p => p.OrdersProducts)
                    .HasForeignKey(d => d.OrderCode)
                    .HasConstraintName("FK__ordersPro__order__45F365D3");

                entity.HasOne(d => d.ProductCodeNavigation)
                    .WithMany(p => p.OrdersProducts)
                    .HasForeignKey(d => d.ProductCode)
                    .HasConstraintName("FK__ordersPro__produ__46E78A0C");
            });

            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(e => e.ProductCode)
                    .HasName("PK__Products__C206838856A1232E");

                entity.ToTable("Products");

                entity.Property(e => e.ProductCode).HasColumnName("productCode");

                entity.Property(e => e.GmachCode).HasColumnName("gmachCode");

                entity.Property(e => e.ProductCount).HasColumnName("productCount");

                entity.Property(e => e.ProductName)
                    .HasMaxLength(50)
                    .HasColumnName("productName");

                entity.HasOne(d => d.GmachCodeNavigation)
                    .WithMany(p => p.Products)
                    .HasForeignKey(d => d.GmachCode)
                    .HasConstraintName("FK__Products__gmachC__3D5E1FD2");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
