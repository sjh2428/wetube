import axios from "axios";

const jsComDelBtn = document.getElementById("jsComDelBtn");
const commentNumber = document.getElementById("jsCommentNumber");

const decreaseNumber = () => {
    commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) -1;
}

const DeleteCom = async (cid) => {
    // console.log(cid);
    const response = await axios({
        url: `/api/delcom`,
        method: "POST",
        data: {
            cid
        }
    });
    if (response.status === 200) {
        if (jsComDelBtn.getAttribute("data") === cid) {
            jsComDelBtn.parentNode.remove();
            decreaseNumber();
        }
    }
}

const handleDeleteCom = () => {
    const cid = jsComDelBtn.getAttribute("data");
    DeleteCom(cid);
}

const init = () => {
    jsComDelBtn.addEventListener("click", handleDeleteCom);
}

if(jsComDelBtn) {
    init();
}