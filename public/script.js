var app = new Vue({
    el: '#app',
    data: {
        showForm: false,
        user: null,
        username: '',
        password: '',
        error: '',
        totalLists: [],
        currentList: {
            _id: '',
            user: '',
            name: '',
            year: Number,
            mapping: {}
        },
        remixedList: {
            _id: '',
            user: '',
            name: '',
            year: Number,
            mapping: {}
        },
        selectedYear: Number,
        selectedName: '',
        yearOptions: [],
        newKey: '',
        newValue: '',
        peopleOptions: [],
    },
    created() {
        this.selectedYear = new Date(Date.now()).getFullYear()-1;
        this.currentList.year = new Date(Date.now()).getFullYear();
        this.remixedList.year = this.currentList.year;
        this.getUser();
        this.yearOptions.push(this.selectedYear);
        this.getLists();
    },
    methods: {
        addNameAsKey() {
            this.currentList.mapping[this.newKey] = this.newValue;
            this.updatePeopleOptions();
            this.newKey = '';
        },
        deleteNameFromKeys(name) {
            delete this.currentList.mapping[name]
            this.updatePeopleOptions();
        },
        updatePeopleOptions() {
            let newPeopleOptions = Object.keys(this.currentList.mapping);
            this.peopleOptions = newPeopleOptions;
        },
        check() {
            console.log(this.currentList);
        },
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
                this.setYearOptions();
            } catch (error) {
                console.log(error);
            }
        },
        setYearOptions() {
            for (const list of this.totalLists) {
                if (!this.yearOptions.includes(list.year)) {
                    this.yearOptions.push(list.year);
                }
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
        async chooseNamesForList() {
            try {
                let response = await axios.put("/api/gifts", {
                    _id: this.currentList._id,
                    user: this.currentList.user,
                    name: this.currentList.name,
                    year: this.currentList.year,
                    mapping: this.currentList.mapping
                });
                console.log(response.data);
            } catch (error) {
                console.log(error);
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