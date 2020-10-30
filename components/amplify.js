"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@aws-cdk/core");
const amplify = require("@aws-cdk/aws-amplify");
class AmplifyConstruct extends core_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        this.amplifyApp = new amplify.CfnApp(this, 'App', props);
        new amplify.CfnBranch(this.amplifyApp, 'MainBranch', {
            appId: this.amplifyApp.attrAppId,
            branchName: 'main'
        });
        new amplify.CfnBranch(this.amplifyApp, 'TestBranch', {
            appId: this.amplifyApp.attrAppId,
            branchName: 'test'
        });
    }
}
exports.AmplifyConstruct = AmplifyConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1wbGlmeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFtcGxpZnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx3Q0FBMEM7QUFFMUMsZ0RBQWdEO0FBRWhELE1BQWEsZ0JBQWlCLFNBQVEsZ0JBQVM7SUFHN0MsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUEwQjtRQUNsRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFekQsSUFBSSxPQUFPLENBQUMsU0FBUyxDQUNuQixJQUFJLENBQUMsVUFBVSxFQUNmLFlBQVksRUFDWjtZQUNFLEtBQUssRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVM7WUFDaEMsVUFBVSxFQUFFLE1BQU07U0FDbkIsQ0FDRixDQUFDO1FBRUYsSUFBSSxPQUFPLENBQUMsU0FBUyxDQUNuQixJQUFJLENBQUMsVUFBVSxFQUNmLFlBQVksRUFDWjtZQUNFLEtBQUssRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVM7WUFDaEMsVUFBVSxFQUFFLE1BQU07U0FDbkIsQ0FDRixDQUFDO0lBQ0osQ0FBQztDQUNGO0FBMUJELDRDQTBCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gXCJAYXdzLWNkay9jb3JlXCI7XG5cbmltcG9ydCAqIGFzIGFtcGxpZnkgZnJvbSBcIkBhd3MtY2RrL2F3cy1hbXBsaWZ5XCI7XG5cbmV4cG9ydCBjbGFzcyBBbXBsaWZ5Q29uc3RydWN0IGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgcHVibGljIHJlYWRvbmx5IGFtcGxpZnlBcHA6IGFtcGxpZnkuQ2ZuQXBwO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBhbXBsaWZ5LkNmbkFwcFByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIHRoaXMuYW1wbGlmeUFwcCA9IG5ldyBhbXBsaWZ5LkNmbkFwcCh0aGlzLCAnQXBwJywgcHJvcHMpO1xuXG4gICAgbmV3IGFtcGxpZnkuQ2ZuQnJhbmNoKFxuICAgICAgdGhpcy5hbXBsaWZ5QXBwLFxuICAgICAgJ01haW5CcmFuY2gnLFxuICAgICAge1xuICAgICAgICBhcHBJZDogdGhpcy5hbXBsaWZ5QXBwLmF0dHJBcHBJZCxcbiAgICAgICAgYnJhbmNoTmFtZTogJ21haW4nXG4gICAgICB9XG4gICAgKTtcblxuICAgIG5ldyBhbXBsaWZ5LkNmbkJyYW5jaChcbiAgICAgIHRoaXMuYW1wbGlmeUFwcCxcbiAgICAgICdUZXN0QnJhbmNoJyxcbiAgICAgIHtcbiAgICAgICAgYXBwSWQ6IHRoaXMuYW1wbGlmeUFwcC5hdHRyQXBwSWQsXG4gICAgICAgIGJyYW5jaE5hbWU6ICd0ZXN0J1xuICAgICAgfVxuICAgICk7XG4gIH1cbn0iXX0=