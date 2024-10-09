from app.models import db, JobType

def create_job_type(data):
    job_type = JobType(name=data['name'])
    db.session.add(job_type)
    db.session.commit()
    return job_type

def get_all_job_types():
    return JobType.query.all()

def get_job_type_by_id(job_type_id):
    return JobType.query.get(job_type_id)

def update_job_type(job_type_id, data):
    job_type = JobType.query.get(job_type_id)
    if not job_type:
        return None
    job_type.name = data.get('name', job_type.name)
    db.session.commit()
    return job_type

def delete_job_type(job_type_id):
    job_type = JobType.query.get(job_type_id)
    if not job_type:
        return None
    db.session.delete(job_type)
    db.session.commit()
    return job_type