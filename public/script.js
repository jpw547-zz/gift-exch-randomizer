var app = new Vue({
    el: '#app',
    data: {
        showForm: false,
        user: null,
        username: '',
        password: '',
        error: '',
        totalLists: {},
        currentList: {
            _id: '',
            user: '',
            name: '',
            year: 2019,
            mapping: {}
        }
    },
    created() {
        this.getUser();
    },
    methods: {
        toggleForm() {
            this.error = "";
            this.username = "";
            this.password = "";
            this.showForm = !this.showForm;
        },
        closeForm() {
            this.showForm = false;
        },
        async getLists() {
            try {
                let response = await axios.get("/api/gifts");
                this.totalLists = response.data;
            } catch (error) {
                console.log(error);
            }
        },
        async addGiftExchList() {
            try {
                let response = await axios.post("/api/gifts", {
                    user: this.user.username,
                    name: this.currentList.name,
                    year: this.currentList.year,
                    mapping: this.currentList.mapping
                });
                this.getLists();
            } catch (error) {
                console.log(error);
            }
        },
        async saveGiftExchList() {
            try {
                let response = await axios.put("/api/gifts/" + this.currentList._id, {
                    name: this.currentList.name,
                    year: this.currentList.year,
                    mapping: this.currentList.mapping
                });
                this.getLists();
            } catch (error) {
                console.log(error);
            }
        },
        async deleteGiftExchList(list) {
            try {
                let response = await axios.delete("/api/gifts/" + list._id);
                this.getLists();
            } catch (error) {
                this.toggleForm();
            }
        },
        async register() {
            this.error = "";
            try {
                let response = await axios.post("/api/users", {
                    username: this.username,
                    password: this.password
                });
                this.user = response.data;
                // close the dialog
                this.toggleForm();
            } catch (error) {
                this.error = error.response.data.message;
            }
        },
        async login() {
            this.error = "";
            try {
                let response = await axios.post("/api/users/login", {
                    username: this.username,
                    password: this.password
                });
                this.user = response.data;
                // close the dialog
                this.toggleForm();
            } catch (error) {
                this.error = error.response.data.message;
            }
        },
        async logout() {
            try {
                let response = await axios.delete("/api/users");
                this.user = null;
            } catch (error) {
                console.log("failed to log out user ", error);
            }
        },
        async getUser() {
            try {
                let response = await axios.get("/api/users");
                this.user = response.data;
            } catch (error) {
                //console.log("failed to get user ", error);
            }
        }
    }
});