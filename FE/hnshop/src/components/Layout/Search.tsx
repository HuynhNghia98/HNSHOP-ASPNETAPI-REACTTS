import { ChangeEvent, useState } from "react";
import HomeServices from "../../Services/Customer/HomeServices";
import { IProduct } from "../../Services/Interfaces/Interfaces";
import FormatCurrency from './../../Utility/FormatCurrency';
import { Link } from "react-router-dom";

const Search = () => {
    const [search, setSearch] = useState<string>('');
    const [products, setProducts] = useState<IProduct[]>([]);
    console.log(search)
    const handleInputSearch = async (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        if (search !== '' && search !== null) {
            const res = await HomeServices.postSearch(search);
            console.log(res)
            if (res.isSuccess) {
                setProducts(res.result);
            } else {
                alert('cannot fetch')
            }
        }
    }

    return (<>
        <div className="input-group mb-3">
            <input type="text" className="form-control" placeholder="search here..." aria-label="Recipient's username" aria-describedby="button-addon2"
                value={search}
                onChange={(e) => handleInputSearch(e)}
            />
            <button className="btn btn-outline-secondary" type="button" id="button-addon2"><i className="bi bi-search fs-5"></i></button>
        </div>
        {products && products.map((p, i) => (
            <div key={i}>
                <div className="row">
                    <div className="col-4">
                        <img src={`https://localhost:5000${p.images ? p.images[0].imageUrl : ''}`} alt={p.images ? p.images[0].imageUrl : ''}
                            className="d-block w-100"></img>
                    </div>
                    <div className="col">
                        <p className="fw-bold"><Link to={`/${p.subCategory?.urlName}/p/${p.slug}`} className="text-dark">{p.name}</Link></p>
                        <p className="fw-bold">{FormatCurrency(p.price)}</p>
                    </div>
                </div>
                <hr />
            </div>
        ))}
    </>)
}

export default Search;