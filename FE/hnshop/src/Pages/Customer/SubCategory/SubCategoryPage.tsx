import { Link, useParams } from "react-router-dom";
import { useEffect } from 'react';
import { useState } from 'react';
import { ISubCategory, IProduct } from '../../../Services/Interfaces/Interfaces';
import SubCategoryPageServices from "../../../Services/Customer/SubCategoryPageServices";

const SubCategoryPage = () => {
    const { subCategoryUrlName } = useParams();

    const [subCategory, setSubCategory] = useState<ISubCategory>();
    const [products, setProducts] = useState<IProduct[]>([]);
    const [productColors, setProductColors] = useState<IProduct[]>([]);
    //paginated
    const [pageIndex, setPageIndex] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [hasPreviousPage, setHasPreviousPage] = useState<boolean>(false);
    const [hasNextPage, setHasNextPage] = useState<boolean>(false);
    // filter   
    const [colorFilter, setColorFilter] = useState<number>(0);
    const [priceFilter, setPriceFilter] = useState<string>('');
    const [sortFilter, setSortFilter] = useState<string>('');
    // filtered
    const [colorFiltered, setColorFiltered] = useState<number>(0);
    const [priceFiltered, setPriceFiltered] = useState<string>('');
    const [sortFiltered, setSortFiltered] = useState<string>('');
    //unique color array
    const uniqueColors: string[] = [];

    useEffect(() => {
        SubCategoryPageServices.getSubCategoryPage(subCategoryUrlName || '').then((res) => {
            if (res.isSuccess) {
                setSubCategory(res.result.subCategory);
                setProducts(res.result.products);
                setProductColors(res.result.productColors);
                setPageIndex(res.result.pageIndex);
                setTotalPages(res.result.totalPages);
                setHasPreviousPage(res.result.hasPreviousPage);
                setHasNextPage(res.result.hasNextPage);
            } else {
            }
        })
    }, [subCategoryUrlName])

    const handleColorFilterChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setColorFilter(parseInt(e.target.value, 10));
    };

    const handlePriceFilterChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setPriceFilter(e.target.value);
    };

    const handleSortFilterChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setSortFilter(e.target.value);
    };

    const handleResetFilter = () => {
        setColorFilter(0);
        setPriceFilter('');
        setSortFilter('');
    }

    const handleFilterSubmit = async (e: React.FormEvent<HTMLFormElement>, urlName: string, price: string, color: number, sort: string) => {
        e.preventDefault();
        setColorFiltered(color);
        setPriceFiltered(price);
        setSortFiltered(sort);
        await SubCategoryPageServices.postSubCategoryPageFilter(urlName, price, color, sort, pageIndex).then((res) => {
            if (res.isSuccess) {
                setSubCategory(res.result.subCategory);
                setProducts(res.result.products);
                setProductColors(res.result.productColors);
                setPageIndex(res.result.pageIndex);
                setTotalPages(res.result.totalPages);
                setHasPreviousPage(res.result.hasPreviousPage);
                setHasNextPage(res.result.hasNextPage);
            } else {
                alert("cannot fetch")
            }
        })
    }

    const handlePageIndex = async (page: number) => {
        await SubCategoryPageServices.postSubCategoryPageFilter(subCategoryUrlName || '', priceFiltered, colorFiltered, sortFiltered, page).then((res) => {
            if (res.isSuccess) {
                setSubCategory(res.result.subCategory);
                setProducts(res.result.products);
                setProductColors(res.result.productColors);
                setPageIndex(res.result.pageIndex);
                setTotalPages(res.result.totalPages);
                setHasPreviousPage(res.result.hasPreviousPage);
                setHasNextPage(res.result.hasNextPage);
            } else {
                alert("cannot fetch")
            }
        })
    }

    return (
        <section className="bg-white border-top pb-5">
            <div className="container py-4">
                <h1 className="mb-4 fw-bold">{subCategory?.name} <span className="fs-4 fw-normal">({products.length})</span></h1>
                <div className="mb-3">
                    <p className="d-inline-flex gap-1">
                        <button className="btn btn-outline-dark rounded-0" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                            <i className="bi bi-funnel-fill"></i> Filter
                        </button>
                    </p>
                    <div className="collapse mb-3" id="collapseExample">
                        <form onSubmit={(e) => handleFilterSubmit(e, subCategoryUrlName || '', priceFilter || '', colorFilter || 0, sortFilter || '')}>
                            <div className="row g-0">


                                <div className="col">
                                    <div className="card rounded-0 hide-border-right" style={{ fontSize: 12 }}>
                                        <div className="card-header">
                                            Giá
                                        </div>
                                        <div className="card-body p-0 custom-scrollbar px-2" style={{ maxHeight: 150, height: 150, overflow: 'auto' }}>
                                            <span >
                                                <input
                                                    id="price1"
                                                    name="price"
                                                    type="radio"
                                                    className="d-none"
                                                    value="price1"
                                                    checked={priceFilter === 'price1'}
                                                    onChange={(e) => handlePriceFilterChange(e)}
                                                />
                                                <label
                                                    htmlFor="price1"
                                                    className={`btn btn-outline-dark rounded-0 mt-2 me-2 
                                                ${priceFilter === 'price1' ? 'active' : ''}`}
                                                >
                                                    {"<"} 50
                                                </label>

                                                <input
                                                    id="price2"
                                                    name="price"
                                                    type="radio"
                                                    className="d-none"
                                                    value="price2"
                                                    checked={priceFilter === 'price2'}
                                                    onChange={(e) => handlePriceFilterChange(e)}
                                                />
                                                <label
                                                    htmlFor="price2"
                                                    className={`btn btn-outline-dark rounded-0 mt-2 me-2 
                                                ${priceFilter === 'price2' ? 'active' : ''}`}
                                                >
                                                    51 - 100
                                                </label>

                                                <input
                                                    id="price3"
                                                    name="price"
                                                    type="radio"
                                                    className="d-none"
                                                    value="price3"
                                                    checked={priceFilter === 'price3'}
                                                    onChange={(e) => handlePriceFilterChange(e)}
                                                />
                                                <label
                                                    htmlFor="price3"
                                                    className={`btn btn-outline-dark rounded-0 mt-2 me-2 
                                                ${priceFilter === 'price3' ? 'active' : ''}`}
                                                >
                                                    101 - 500
                                                </label>

                                                <input
                                                    id="price4"
                                                    name="price"
                                                    type="radio"
                                                    className="d-none"
                                                    value="price4"
                                                    checked={priceFilter === 'price4'}
                                                    onChange={(e) => handlePriceFilterChange(e)}
                                                />
                                                <label
                                                    htmlFor="price4"
                                                    className={`btn btn-outline-dark rounded-0 my-2 me-2 
                                                ${priceFilter === 'price4' ? 'active' : ''}`}
                                                >
                                                    {">"} 500
                                                </label>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card rounded-0 hide-border-right" style={{ fontSize: 12 }}>
                                        <div className="card-header">
                                            Màu sắc
                                        </div>
                                        <div className="card-body p-0 custom-scrollbar" style={{ maxHeight: 150, height: 150, overflowY: 'auto' }}>
                                            <div className="row ps-4 py-2" style={{ width: "99%" }}>
                                                {productColors &&
                                                    productColors.map((x, index) => {
                                                        if (!uniqueColors.includes(x.color?.name ?? '')) {
                                                            uniqueColors.push(x.color?.name ?? '');
                                                            const color = x.color?.name.trim().toLocaleLowerCase();

                                                            return (
                                                                <div key={index} className="col-6 mb-2">
                                                                    <div className="row">
                                                                        <input
                                                                            id={x.name}
                                                                            value={x.color?.id}
                                                                            name="color"
                                                                            type="radio"
                                                                            checked={colorFilter === x.color?.id}
                                                                            className="form-check col-3 color-checked"
                                                                            style={{ backgroundColor: `${color}`, cursor: "pointer" }}
                                                                            onChange={(e) => handleColorFilterChange(e)}
                                                                        />
                                                                        <label
                                                                            htmlFor={x.name}
                                                                            className={`form-check-label col-6 ${colorFilter === x.color?.id ? 'active' : ''}`}
                                                                            style={{ backgroundColor: `${color}` }}
                                                                        ></label>
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                    })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card rounded-0" style={{ fontSize: 12 }}>
                                        <div className="card-header">
                                            Sắp xếp
                                        </div>
                                        <div className="card-body p-0 custom-scrollbar px-3" style={{ maxHeight: 150, height: 150, overflow: 'auto' }}>
                                            <input
                                                id="az"
                                                name="sort"
                                                type="radio"
                                                className="d-none"
                                                value="az"
                                                checked={sortFilter === "az"}
                                                onChange={(e) => handleSortFilterChange(e)}
                                            />
                                            <label
                                                htmlFor="az"
                                                className={`btn btn-outline-dark rounded-0 mt-2 me-2 ${sortFilter === 'az' ? 'active' : ''}`}
                                            >
                                                Name: A - Z
                                            </label>
                                            <input
                                                id="za"
                                                name="sort"
                                                type="radio"
                                                className="d-none"
                                                value="za"
                                                checked={sortFilter === "za"}
                                                onChange={(e) => handleSortFilterChange(e)}
                                            />
                                            <label
                                                htmlFor="za"
                                                className={`btn btn-outline-dark rounded-0 mt-2 me-2 ${sortFilter === 'za' ? 'active' : ''}`}
                                            >
                                                Name: Z - A
                                            </label>
                                            <input
                                                id="desc"
                                                name="sort"
                                                type="radio"
                                                className="d-none"
                                                value="desc"
                                                checked={sortFilter === "desc"}
                                                onChange={(e) => handleSortFilterChange(e)}
                                            />
                                            <label
                                                htmlFor="desc"
                                                className={`btn btn-outline-dark rounded-0 mt-2 me-2 ${sortFilter === 'desc' ? 'active' : ''}`}
                                            >
                                                Price: High to Low
                                            </label>
                                            <input
                                                id="asc"
                                                name="sort"
                                                type="radio"
                                                className="d-none"
                                                value="asc"
                                                checked={sortFilter === "asc"}
                                                onChange={(e) => handleSortFilterChange(e)}
                                            />
                                            <label
                                                htmlFor="asc"
                                                className={`btn btn-outline-dark rounded-0 mt-2 me-2 ${sortFilter === 'asc' ? 'active' : ''}`}
                                            >
                                                Price: Low to High
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card rounded-0 hide-border-right" style={{ fontSize: 12 }}>
                                        <div className="card-header">
                                        </div>
                                        <div className="card-body p-0 custom-scrollbar px-2" style={{ maxHeight: 150, height: 150, overflow: 'auto' }}>
                                        </div>
                                    </div>
                                </div>
                                <div className="card rounded-0 border-top-0">
                                    <div className="card-footer border-top-0">
                                        <button className="btn btn-dark fs-7 rounded-0" style={{ width: 100 }} type="submit">Lọc</button>
                                        <button className="btn btn-outline-secondary fs-7 rounded-0 ms-2" style={{ width: 100 }}
                                            onClick={handleResetFilter}
                                        >
                                            Xóa bộ lọc
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="row">
                    {products && products.map((p, index1) => (
                        <div key={index1} className="col-3 mb-4">
                            <div id={`carousel${p.id}`} data-bs-target={`#carousel${p.id}`} className="carousel slide">
                                <div className="carousel-inner">
                                    {p.images && p.images.map((image, index2) => (
                                        <div key={index2} className={`carousel-item ${index2 === 0 ? 'active' : ''}`}>
                                            <Link to={`/${p.subCategory?.urlName}/p/${p.slug}`}>
                                                <img src={`https://localhost:5000${image.imageUrl}`} alt={image.imageUrl}
                                                    className="d-block w-100"></img>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                                <button className="carousel-control-prev" type="button" data-bs-target={`#carousel${p.id}`} data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true" />
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target={`#carousel${p.id}`} data-bs-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true" />
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </div>
                            <p className="mb-1">
                                <i className="bi bi-circle-fill me-1" style={{ color: `${p.color?.name}`, width: "10px" }}></i>
                                {p.color?.name}</p>
                            <h5 className="fw-bold mb-1">{p.name}</h5>
                            <p className="fw-bold">$ {p.price}</p>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    {hasPreviousPage ? (
                        <button onClick={() => handlePageIndex(1)} className="btn btn-outline-dark rounded-0 mx-1">First</button>
                    ) : null}
                    {pageIndex > 2 ? (
                        <span><i className="bi bi-three-dots"></i></span>
                    ) : null}
                    {(() => {
                        const buttons = [];
                        for (let i = -2; i <= 2; i++) {
                            const pageNumber = pageIndex + i;
                            if (pageNumber >= 1 && pageNumber <= totalPages) {
                                buttons.push(
                                    <button
                                        key={i}
                                        onClick={() => handlePageIndex(pageNumber)}
                                        className={`btn btn-outline-dark rounded-0 mx-1 ${pageIndex === pageNumber ? 'active' : ''}`}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            }

                        }
                        return buttons;
                    })()}

                    {pageIndex < totalPages - 1 ? (
                        <span><i className="bi bi-three-dots"></i></span>
                    ) : null}

                    {hasNextPage ? (
                        <button onClick={() => handlePageIndex(totalPages)} className="btn btn-outline-dark rounded-0 mx-1">Last</button>
                    ) : null}
                </div>
            </div>
        </section>
    )
}

export default SubCategoryPage;