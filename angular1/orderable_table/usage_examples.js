angular.module('table_helper', ['jobcommons', 'talhaocommons']);

angular.module('table_helper').factory('TableHelper', function(JobUtil, $filter, $state){
    var m = {};
    angular.extend(m, {
        jobs_table_options: jobs_table_options,
        jobs_table_filter: jobs_table_filter,
        talhoes_table_options: talhoes_table_options,
        talhoes_table_filter: talhoes_table_filter,
        job_detail_table_options: job_detail_table_options,
        service_table_options: service_table_options,
        users_table_options: users_table_options,
        clients_table_options: clients_table_options,
        watchers_table_options: watchers_table_options
    });

    function watchers_table_options(profile_service){
        var column_job_id = {
            header: 'JOB ID',
            value: function(item){return item.job.id;},
            bold: true,
            width: 70,
            menu: [
                {
                    action: profile_service.remove_job,
                    label: 'Parar de acompanhar'
                }
            ]
        };
        var column_client = {
            header: 'Cliente',
            value: function(item){return item.job.client;},
            width: 100,
            click: function(item){$state.go('jobdetail', {job_id: item.job.id})}
        };
        var column_talhoes = {
            header: 'Nº Talhões',
            value: function(item){return item.job.talhoes.length;},
            width: 90,
            click: function(item){$state.go('jobdetail', {job_id: item.job.id})},
            title: function(item){return item.job.talhoes.map(function(tal){return tal.hash;}).join('\n');}
        };
        var column_operator = {
            header: 'Operador',
            value: function(item){return item.job.creator;},
            width: 150,
            click: function(item){$state.go('jobdetail', {job_id: item.job.id})}
        };
        var column_create_time = {
            header: 'Criado em',
            value: function(item){return $filter('date')(item.job.create_time, 'dd/MM/yyyy HH:mm');},
            ordered_value: function(item){return item.job.create_time;},
            width: 90,
            click: function(item){$state.go('jobdetail', {job_id: item.job.id})},
        };
        var column_description = {
            header: 'Descrição',
            value: function(item){return JobUtil.job_description(item.job);},
            width: profile_service.superuser_permission?400:500,
            click: function(item){$state.go('jobdetail', {job_id: item.job.id})},
        };
        var column_status = {
            header: 'Status',
            value: function(item){return $filter('jobstatus')(JobUtil.job_status(item.job));},
            width: 200,
            span_classes: function(item){return 'label label-' + $filter('statuscssclass')(JobUtil.job_status(item.job),'job');},
            click: function(item){$state.go('jobdetail', {job_id: item.job.id})},
        };
        var table_options = {
            clickable: true,
            columns: [
                column_job_id,
                column_client,
                column_talhoes,
                column_operator,
                column_create_time,
                column_description,
                column_status
            ],
            track_by: 'id'
        };
        if (!profile_service.superuser_permission){
            table_options.columns.splice(1,1);
        }
        return table_options;
    }

    function clients_table_options(clients_service){
        var column_id = {
            header: 'ID',
            value: function(item){return item.id;},
            width: 150,
            click: function(item){clients_service.select_client(item)},
        };
        var column_name = {
            header: 'Nome',
            value: function(item){return item.name;},
            width: 300,
            click: function(item){clients_service.select_client(item)},
        };
        var table_options={
            clickable: clients_service.clickable,
            columns: [
                column_id,
                column_name,
            ],
            track_by: 'id'
        };
        return table_options;
    }

    function users_table_options(users_service){
        var column_username = {
            header: 'username',
            value: function(item){return item.username;},
            width: 150,
            click: function(item){users_service.select_user(item)},
        };
        var column_email = {
            header: 'email',
            value: function(item){return item.email;},
            width: 300,
            click: function(item){users_service.select_user(item)},
        };
        var column_first_name = {
            header: 'Primeiro Nome',
            value: function(item){return item.first_name;},
            width: 250,
            click: function(item){users_service.select_user(item)},
        };
        var column_last_name = {
            header: 'Último Nome',
            value: function(item){return item.last_name;},
            width: 250,
            click: function(item){users_service.select_user(item)},
        };
        var table_options={
            clickable: users_service.clickable,
            columns: [
                column_username,
                column_email,
                column_first_name,
                column_last_name
            ],
            track_by: 'username'
        };
        return table_options;
    }

    function service_table_options(service_service){
        var column_id = {
            header: 'ID',
            value: function(item){return item.id;},
            width: 40,
            click: function(item){service_service.select_service(item)},
        };
        var column_result = {
            header: 'Result Queue',
            value: function(item){return item.result_queue;},
            width: 150,
            click: function(item){service_service.select_service(item)},
        };
        var column_proc = {
            header: 'Proc Queue',
            value: function(item){return item.proc_queue;},
            width: 150,
            click: function(item){service_service.select_service(item)},
        };
        var column_runrepo = {
            header: 'Run Repo',
            value: function(item){return '...' + item.run_repo.slice(35);},
            width: 300,
            click: function(item){service_service.select_service(item)},
        };
        var column_runversion = {
            header: 'Run Version',
            value: function(item){return item.run_version.slice(0,20);},
            width: 200,
            click: function(item){service_service.select_service(item)},
        };
        var table_options={
            clickable:service_service.clickable,
            item_bold: function(item){
                return item.is_default;
            },
            columns: [
                column_id,
                column_result,
                column_proc,
                column_runrepo,
                column_runversion
            ],
        };
        return table_options;
    }

    function job_detail_table_options(jobdetail_service){
        var column_id = {
            header: 'ID Talhão',
            bold: true,
            value: function(item){return item.hash;},
            width: 160,
            checkbox: true,
            click: function(item){$state.go('talhaodetail', {job_id: item.job_id, talhao_id: item.id})},
            menu: [
                {
                    action: jobdetail_service.download_image,
                    label: 'Baixar imagem'
                }
            ]
        };
        var column_project = {
            header: 'ID Projeto',
            value: function(item){return item.project_id;},
            width: 100,
            click: function(item){$state.go('talhaodetail', {job_id: item.job_id, talhao_id: item.id})},
        };
        var column_create_time = {
            header: 'Processado em',
            value: function(item){return $filter('date')(item.create_time, 'dd/MM/yyyy HH:mm');},
            ordered_value: function(item){return item.create_time;},
            width: 240,
            click: function(item){$state.go('talhaodetail', {job_id: item.job_id, talhao_id: item.id})},
        };
        var column_approved_time = {
            header: 'Último parecer',
            value: function(item){return $filter('date')(item.last_update, 'dd/MM/yyyy HH:mm');},
            ordered_value: function(item){return item.last_update;},
            width: 240,
            click: function(item){$state.go('talhaodetail', {job_id: item.job_id, talhao_id: item.id})},
        };
        var column_area = {
            header: 'Área (ha)',
            value: function(item){return $filter('number')(item.area, 3);},
            width: 100,
            click: function(item){$state.go('talhaodetail', {job_id: item.job_id, talhao_id: item.id})},
        };
        var column_status = {
            header: 'Status',
            value: function(item){return $filter('talhaostatus')(item.status);},
            width: 300,
            span_classes: function(item){return 'label label-' + $filter('statuscssclass')(item.status,'talhao');},
            click: function(item){$state.go('talhaodetail', {job_id: item.job_id, talhao_id: item.id})},
            show_filter_button: true
        };
        var table_options={
            clickable:true,
            columns: [
                column_id,
                column_project,
                column_create_time,
                column_approved_time,
                column_area,
                column_status
            ],
        };
        return table_options;
    }

    function talhoes_table_filter(talhoes_service){
        return function(tal){
            if (talhoes_service.filters.job_id && talhoes_service.filters.job_id !== ''){
                if (tal.job_id != talhoes_service.filters.job_id){
                    tal.selected = false;
                    return false;
                }
            }
            if (talhoes_service.filters.project_id && talhoes_service.filters.project_id !== ''){
                if (tal.project_id != talhoes_service.filters.project_id){
                    tal.selected = false;
                    return false;
                }
            }
            if (talhoes_service.filters.client && talhoes_service.filters.client !== ''){
                if (tal.client != talhoes_service.filters.client){
                    tal.selected = false;
                    return false;
                }
            }
            if (!tal.create_time_date){
                tal.create_time_date = new Date(tal.create_time);
            }
            if (talhoes_service.filters.since && tal.create_time_date < talhoes_service.filters.since){
                tal.selected = false;
                return false;
            }
            if (talhoes_service.filters.until && tal.create_time_date - talhoes_service.filters.until > 86400000){ // UM DIA 1000*60*60*24
                tal.selected = false;
                return false;
            }
            if (talhoes_service.filters.area_gt && talhoes_service.filters.area_gt > 0){
                if (tal.area < talhoes_service.filters.area_gt){
                    tal.selected = false;
                    return false;
                }
            }
            if (talhoes_service.filters.area_lt && talhoes_service.filters.area_lt > 0){
                if (tal.area > talhoes_service.filters.area_lt){
                    tal.selected = false;
                    return false;
                }
            }
            if (!talhoes_service.filters.status[tal.status]){
                tal.selected = false;
                return false;
            }
            return true;
        }
    }

    function talhoes_table_options(talhoes_service){
        var column_id = {
            header: 'ID Talhão',
            bold: true,
            value: function(item){return item.hash;},
            width: 120,
            checkbox: true,
            click: function(item){$state.go('talhaodetail', {job_id: item.job_id, talhao_id: item.id})},
            menu: [
                {
                    action: talhoes_service.download_image,
                    label: 'Baixar imagem'
                }
            ]
        };
        var column_job = {
            header: 'ID Job',
            value: function(item){return item.job_id;},
            width: talhoes_service.superuser_permission ? 90 : 140,
            click: function(item){$state.go('talhaodetail', {job_id: item.job_id, talhao_id: item.id})},
        };
        var column_client = {
            header: 'Client',
            value: function(item){return item.client;},
            width: 100,
            click: function(item){$state.go('talhaodetail', {job_id: item.job_id, talhao_id: item.id})},
        };
        var column_project = {
            header: 'ID Projeto',
            value: function(item){return item.project_id;},
            width: talhoes_service.superuser_permission ? 80 : 120,
            click: function(item){$state.go('talhaodetail', {job_id: item.job_id, talhao_id: item.id})},
        };
        var column_create_time = {
            header: 'Processado em',
            value: function(item){return $filter('date')(item.create_time, 'dd/MM/yyyy HH:mm');},
            ordered_value: function(item){return item.create_time;},
            width: 195,
            click: function(item){$state.go('talhaodetail', {job_id: item.job_id, talhao_id: item.id})},
        };
        var column_last_iteraction = {
            header: 'Último parecer',
            value: function(item){return $filter('date')(item.last_update, 'dd/MM/yyyy HH:mm');},
            ordered_value: function(item){return item.last_update;},
            width: 195,
            click: function(item){$state.go('talhaodetail', {job_id: item.job_id, talhao_id: item.id})},
        };
        var column_area = {
            header: 'Área (ha)',
            value: function(item){return $filter('number')(item.area, 3);},
            width: 100,
            click: function(item){$state.go('talhaodetail', {job_id: item.job_id, talhao_id: item.id})},
        };
        var column_status = {
            header: 'Status',
            value: function(item){return $filter('talhaostatus')(item.status);},
            width: 250,
            span_classes: function(item){return 'label label-' + $filter('statuscssclass')(item.status,'talhao');},
            click: function(item){$state.go('talhaodetail', {job_id: item.job_id, talhao_id: item.id})},
            show_filter_button: true
        };
        var table_options={
            clickable:true,
            columns: [
                column_id,
                column_job,
                column_client,
                column_project,
                column_create_time,
                column_last_iteraction,
                column_area,
                column_status
            ],
            order_by: column_job,
            reverse: true
        };
        if (!talhoes_service.superuser_permission){
            table_options.columns.splice(2,1);
        }

        return table_options;
    }

    function jobs_table_filter(jobs_service){
        return function(job){
            if (jobs_service.filters.client && jobs_service.filters.client != ''){
                if (job.client.indexOf(jobs_service.filters.client) === -1){
                    job.selected = false;
                    return false;
                }
            }
            if (jobs_service.filters.operator && jobs_service.filters.operator != ''){
                if (job.creator.indexOf(jobs_service.filters.operator) === -1){
                    job.selected = false;
                    return false;
                }
            }
            if (jobs_service.filters.description && jobs_service.filters.description != ''){
                if (JobUtil.job_description(job).indexOf(jobs_service.filters.description) === -1){
                    job.selected = false;
                    return false;
                }
            }
            if (!jobs_service.filters.status[JobUtil.job_status(job)]){
                job.selected = false;
                return false;
            }
            if (!job.create_time_date){
                job.create_time_date = new Date(job.create_time);
            }
            if (jobs_service.filters.since && job.create_time_date < jobs_service.filters.since){
                job.selected = false;
                return false;
            }
            if (jobs_service.filters.until && job.create_time_date - jobs_service.filters.until > 86400000){ // UM DIA 1000*60*60*24
                job.selected = false;
                return false;
            }
            return true;
        }
    }

    function jobs_table_options(jobs_service){
        var column_id = {
            header: 'id',
            bold: true,
            value: function(item){return item.id;},
            width: 100,
            checkbox: true,
            click: function(item){$state.go('jobdetail', {job_id: item.id})},
            menu: [
                {
                    action: jobs_service.clone_job,
                    label: 'Clonar Job'
                },{
                    action: jobs_service.edit_job,
                    label: 'Editar Job'
                },{
                    action: jobs_service.download_image,
                    label: 'Baixar imagem'
                }
            ]
        };
        if (!jobs_service.superuser_permission){
            column_id.menu.splice(0,2);
        }
        var column_client = {
            header: 'Cliente',
            value: function(item){return item.client;},
            width: 120,
            click: function(item){$state.go('jobdetail', {job_id: item.id})}
        };
        var column_operator = {
            header: 'Operador',
            value: function(item){return item.creator;},
            width: 120,
            click: function(item){$state.go('jobdetail', {job_id: item.id})}
        };
        var column_create_time = {
            header: 'Criado em',
            value: function(item){return $filter('date')(item.create_time, 'dd/MM/yyyy HH:mm');},
            ordered_value: function(item){return item.create_time;},
            width: 100,
            click: function(item){$state.go('jobdetail', {job_id: item.id})},
        };
        var column_description = {
            header: 'Descrição',
            value: function(item){return JobUtil.job_description(item);},
            width: jobs_service.superuser_permission?470:590,
            click: function(item){$state.go('jobdetail', {job_id: item.id})},
        };
        var column_status = {
            header: 'Status',
            value: function(item){return $filter('jobstatus')(JobUtil.job_status(item));},
            width: 200,
            span_classes: function(item){return 'label label-' + $filter('statuscssclass')(JobUtil.job_status(item),'job');},
            click: function(item){$state.go('jobdetail', {job_id: item.id})},
            show_filter_button: true
        };
        var table_options={
            clickable:true,
            columns: [
                column_id,
                column_client,
                column_operator,
                column_create_time,
                column_description,
                column_status
            ],
        };
        if (!jobs_service.superuser_permission){
            table_options.columns.splice(1,1);
        }
        return table_options;
    }

    return m;
});
