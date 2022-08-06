import { useState } from "react";

export default () => {
    const [count, setCount] = useState(0);
    return (
        <div>
            <h1 onClick={() => setCount(count + 1)}>{count}</h1>
        </div>
    );
}